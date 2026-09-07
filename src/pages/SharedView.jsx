import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { calculateAge } from '../utils/ageCalculator';
import {
  getVaccineStatus,
  getVaccineProgress,
  getVaccinationStage,
  getPrivateVaccineStatus,
  getCombinedProgress,
} from '../utils/vaccineEngine';
import { sanitizeString, validateDob, validateBase64Json } from '../utils/validation';
import AppShell from '../components/AppShell';
import ProgressBar from '../components/ProgressBar';
import VaccineCard from '../components/VaccineCard';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';

const PUBLIC_HEADER = { showPrivacy: false, showUser: false };

const SharedView = () => {
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name');
  const dobParam = searchParams.get('dob');
  const vaccinesParam = searchParams.get('v');

  const [babyData, setBabyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const name = sanitizeString(nameParam, 50);
    const dobValidation = validateDob(dobParam);
    const vaccinesValidation = validateBase64Json(vaccinesParam);

    if (!name || !dobValidation.isValid) {
      setError('Invalid or missing data in share link');
      return;
    }

    setBabyData({
      name,
      dob: dobValidation.value,
      vaccines: vaccinesValidation.value,
    });
  }, [nameParam, dobParam, vaccinesParam]);

  if (!babyData || error) {
    return (
      <AppShell width="narrow" header={PUBLIC_HEADER}>
        <Card>
          <h1 className="text-xl font-bold text-ink mb-1.5">Invalid share link</h1>
          <p className="text-sm text-ink-2">
            {error || 'This share link is missing required information.'}
          </p>
        </Card>
      </AppShell>
    );
  }

  const age = calculateAge(babyData.dob);
  const vaccines = getVaccineStatus(babyData.dob, babyData.vaccines || {});
  const privateVaccines = getPrivateVaccineStatus(babyData.dob, babyData.vaccines || {});
  const progress = getVaccineProgress(vaccines);
  const privateProgress = getVaccineProgress(privateVaccines);
  const combinedProgress = getCombinedProgress(vaccines, privateVaccines);
  const stage = getVaccinationStage(vaccines);

  return (
    <AppShell header={PUBLIC_HEADER}>
      <div className="flex flex-col gap-3 mb-6 motion-rise">
        <div>
          <Badge tone="neutral">Read-only view</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{babyData.name}&rsquo;s vaccine schedule</h1>
        <p className="text-[15px] text-ink-2">Based on the Bangladesh EPI schedule.</p>
      </div>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <Avatar name={babyData.name} size="lg" />
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-ink truncate">{babyData.name}</h2>
            {age && (
              <>
                <p className="text-sm font-medium text-ink-2 mt-0.5">{age.formatted}</p>
                <p className="text-[13px] text-ink-3">
                  {age.totalDays} days · {age.totalWeeks} weeks · {age.totalMonths} months
                </p>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-line pt-5 mt-5 flex flex-col gap-3">
          <ProgressBar
            completed={combinedProgress.completed}
            total={combinedProgress.total}
            percentage={combinedProgress.percentage}
            label="Overall vaccination progress"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="soon">
              EPI {progress.completed}/{progress.total}
            </Badge>
            <Badge tone="accent">
              Private {privateProgress.completed}/{privateProgress.total}
            </Badge>
            <Badge tone="neutral">{stage}</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader
          as="h2"
          title="EPI vaccine schedule"
          lead={`${progress.completed} of ${progress.total} given.`}
          aside={<Badge tone="soon">Government</Badge>}
          className="mb-4"
        />
        <div className="card row-divider">
          {vaccines.map((vaccine) => (
            <VaccineCard key={vaccine.key} vaccine={vaccine} readOnly />
          ))}
        </div>
      </Card>

      <Card className="mt-6">
        <SectionHeader
          as="h2"
          title="Private vaccination schedule"
          lead={`${privateProgress.completed} of ${privateProgress.total} given.`}
          aside={<Badge tone="accent">Private</Badge>}
          className="mb-4"
        />
        <div className="card row-divider">
          {privateVaccines.map((vaccine) => (
            <VaccineCard key={vaccine.key} vaccine={vaccine} readOnly />
          ))}
        </div>
      </Card>

      <Alert tone="caution" icon={ExclamationTriangleIcon} title="Medical disclaimer" className="mt-6">
        This app follows the Bangladesh EPI schedule and includes additional private vaccination
        recommendations. Always consult a qualified healthcare professional for medical advice and
        vaccination guidance.
      </Alert>
    </AppShell>
  );
};

export default SharedView;
