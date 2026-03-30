import { matchOutbreakToDiseases } from '../config/outbreakVaccineMap';

// Critical hardcoded alerts for immediate threats
const CRITICAL_ALERTS = [
  {
    id: 'bd-measles-2026',
    title: 'Measles Outbreak in Bangladesh',
    summary: 'A significant measles outbreak has been reported across multiple districts in Bangladesh. Health authorities urge parents to ensure children are vaccinated with MR/MMR vaccines on schedule.',
    severity: 'critical',
    date: '2026-03-15',
    source: 'DGHS Bangladesh',
    region: 'Bangladesh',
    diseases: ['measles'],
    isHardcoded: true
  }
];

const RELIEFWEB_API = 'https://api.reliefweb.int/v1/reports';

// Cache outbreak data for 1 hour
let cachedOutbreaks = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch outbreak reports from ReliefWeb API
 */
const fetchFromReliefWeb = async () => {
  const body = {
    appname: 'baby-care-tracker',
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
      include: ['title', 'date.created', 'url_alias', 'source.name', 'theme.name']
    },
    sort: ['date.created:desc'],
    limit: 10
  };

  const response = await fetch(RELIEFWEB_API, {
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
      date: fields['date.created'] || '',
      source: fields['source.name'] || 'ReliefWeb',
      region: 'Bangladesh',
      diseases: diseaseMatches.map(m => m.disease),
      url: fields.url_alias || '',
      isHardcoded: false
    };
  });
};

/**
 * Get all outbreak alerts (hardcoded + API)
 * Filters to only return health-relevant alerts with disease matches
 */
export const getOutbreakAlerts = async () => {
  // Start with critical hardcoded alerts
  const alerts = [...CRITICAL_ALERTS];

  // Check cache
  const now = Date.now();
  if (cachedOutbreaks && (now - cacheTimestamp) < CACHE_DURATION) {
    return deduplicateAlerts([...alerts, ...cachedOutbreaks]);
  }

  // Fetch from API
  try {
    const apiAlerts = await fetchFromReliefWeb();
    // Only keep alerts that matched a known disease
    const relevantAlerts = apiAlerts.filter(a => a.diseases.length > 0);
    cachedOutbreaks = relevantAlerts;
    cacheTimestamp = now;
    return deduplicateAlerts([...alerts, ...relevantAlerts]);
  } catch (error) {
    console.warn('Failed to fetch outbreak data from ReliefWeb:', error.message);
    // Return hardcoded alerts on failure
    return alerts;
  }
};

/**
 * Remove duplicate alerts (same disease from different sources)
 */
const deduplicateAlerts = (alerts) => {
  const seen = new Set();
  return alerts.filter(alert => {
    const key = alert.isHardcoded ? alert.id : `${alert.diseases.sort().join(',')}-${alert.date.slice(0, 7)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
