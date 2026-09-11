import { matchOutbreakToDiseases } from '../config/outbreakVaccineMap';

// v1 was decommissioned and answers 410 to everything, including the CORS
// preflight — which is why this surfaced in the browser as a CORS error rather
// than a version error. v2 additionally requires a registered appname.
const RELIEFWEB_API = 'https://api.reliefweb.int/v2/reports';
const APPNAME = 'matrixlab-mybabycare-7f3a2c';

// Cache outbreak data for 1 hour
let cachedOutbreaks = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch outbreak reports from ReliefWeb API
 */
const fetchFromReliefWeb = async () => {
  const body = {
    appname: APPNAME,
    filter: {
      operator: 'AND',
      conditions: [
        { field: 'country.name', value: 'Bangladesh' },
        {
          field: 'theme.name',
          operator: 'OR',
          value: ['Health', 'Epidemic']
        }
      ]
    },
    fields: {
      include: ['title', 'date.created', 'url_alias', 'source.name']
    },
    sort: ['date.created:desc'],
    limit: 10
  };

  const response = await fetch(`${RELIEFWEB_API}?appname=${APPNAME}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`ReliefWeb API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.data || []).map(report => {
    const fields = report.fields;
    const title = fields.title || '';
    const diseaseMatches = matchOutbreakToDiseases(title);

    return {
      id: `rw-${report.id}`,
      title,
      summary: '',
      severity: diseaseMatches.length > 0 ? 'warning' : 'info',
      // v2 nests what v1 returned as flat dotted keys, and returns source as
      // a list. Reading the old shape here yielded blank dates and sources.
      date: fields.date?.created || '',
      source: fields.source?.[0]?.name || 'ReliefWeb',
      region: 'Bangladesh',
      diseases: diseaseMatches.map(m => m.disease),
      url: fields.url_alias || ''
    };
  });
};

/**
 * Reported outbreaks that match a vaccine on one of the schedules. Everything
 * shown here comes from ReliefWeb; if the feed is unreachable the section
 * simply stays empty, which is the honest answer to "we do not know".
 */
export const getOutbreakAlerts = async () => {
  const now = Date.now();
  if (cachedOutbreaks && (now - cacheTimestamp) < CACHE_DURATION) {
    return deduplicateAlerts(cachedOutbreaks);
  }

  try {
    const apiAlerts = await fetchFromReliefWeb();
    // Only keep alerts that matched a known disease
    const relevantAlerts = apiAlerts.filter(a => a.diseases.length > 0);
    cachedOutbreaks = relevantAlerts;
    cacheTimestamp = now;
    return deduplicateAlerts(relevantAlerts);
  } catch (error) {
    console.warn('Failed to fetch outbreak data from ReliefWeb:', error.message);
    return [];
  }
};

/**
 * Remove duplicate alerts (same disease from different sources)
 */
const deduplicateAlerts = (alerts) => {
  const seen = new Set();
  return alerts.filter(alert => {
    const key = `${alert.diseases.sort().join(',')}-${alert.date.slice(0, 7)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
