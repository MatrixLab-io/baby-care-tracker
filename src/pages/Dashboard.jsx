import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  CheckIcon,
  DocumentIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ShareIcon,
  ShieldCheckIcon,
  TrashIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import {
  getVaccineStatus,
  getVaccineProgress,
  getVaccinationStage,
  getOverdueVaccines,
} from '../utils/vaccineEngine';
import AppShell from '../components/AppShell';
import { CardLoader } from '../components/LoadingCard';
import ProgressBar from '../components/ProgressBar';
import VaccineCard from '../components/VaccineCard';
import MilestoneTracker from '../components/MilestoneTracker';
import GrowthTracker from '../components/GrowthTracker';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ChipSelect from '../components/ui/ChipSelect';
import EmptyState from '../components/ui/EmptyState';
import SectionHeader from '../components/ui/SectionHeader';

const TABS = [
  { id: 'vaccines', label: 'Vaccines', icon: ShieldCheckIcon },
  { id: 'milestones', label: 'Milestones', icon: TrophyIcon },
  { id: 'growth', label: 'Growth', icon: ChartBarIcon },
  { id: 'records', label: 'Records', icon: DocumentTextIcon },
];

const GENDER_LABELS = { male: 'Boy', female: 'Girl' };

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentBaby, babies, switchBaby, toggleVaccineStatus, deleteMedicalRecord, loading } = useBaby();
  const [activeTab, setActiveTab] = useState('vaccines');
  const [loadingVaccineKey, setLoadingVaccineKey] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    const tabElement = tabRefs.current[tabId];
    const container = tabsContainerRef.current;
    if (!tabElement || !container) return;

    const tabIndex = TABS.findIndex((t) => t.id === tabId);
    if (tabIndex === 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (tabIndex === TABS.length - 1) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      container.scrollTo({
        left: tabElement.offsetLeft - containerRect.width / 2 + tabRect.width / 2,
        behavior: 'smooth',
      });
    }
  };

  const handleDeleteRecord = (recordId) => {
    if (window.confirm('Delete this medical record? This cannot be undone.')) {
      deleteMedicalRecord(recordId);
    }
  };

  const handleViewRecord = (record) => {
    // base64 data URL -> blob URL, so the browser opens it in its own viewer
    const byteString = atob(record.data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: record.type });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  if (loading) {
    return (
      <AppShell header={{ showBack: true }}>
        <CardLoader />
      </AppShell>
    );
  }

  if (!currentBaby) {
    return (
      <AppShell header={{ showBack: true }}>
        <Card>
          <EmptyState
            title="No baby selected"
            message="Pick a profile from the home screen to see its dashboard."
            action={
              <Button icon={ArrowLeftIcon} onClick={() => navigate('/')}>
                Go to home
              </Button>
            }
          />
        </Card>
      </AppShell>
    );
  }

  const age = calculateAge(currentBaby.dob);
  const vaccines = getVaccineStatus(currentBaby.dob, currentBaby.vaccines);
  const progress = getVaccineProgress(vaccines);
  const stage = getVaccinationStage(vaccines);
  const overdueVaccines = getOverdueVaccines(vaccines);

  const handleShareClick = async () => {
    const vaccinesData = currentBaby.vaccines ? btoa(JSON.stringify(currentBaby.vaccines)) : '';
    const shareUrl = `${window.location.origin}/share?name=${encodeURIComponent(currentBaby.name)}&dob=${
      currentBaby.dob
    }&v=${vaccinesData}`;
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleVaccineToggle = async (vaccineKey) => {
    setLoadingVaccineKey(vaccineKey);
    try {
      await toggleVaccineStatus(vaccineKey);
    } finally {
      setLoadingVaccineKey(null);
    }
  };

  const medicalRecords = currentBaby.medicalRecords || [];

  return (
    <AppShell header={{ showBack: true }}>
      {babies.length > 1 && (
        <ChipSelect
          label="Baby"
          options={babies.map((baby) => ({ id: baby.id, label: baby.name }))}
          value={currentBaby.id}
          onChange={switchBaby}
          className="mb-6"
        />
      )}

      {/* Profile summary */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Avatar src={currentBaby.photo} name={currentBaby.name} size="xl" />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink truncate">{currentBaby.name}</h1>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {currentBaby.gender && <Badge tone="neutral">{GENDER_LABELS[currentBaby.gender]}</Badge>}
                  {currentBaby.bloodGroup && <Badge tone="danger">Blood {currentBaby.bloodGroup}</Badge>}
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={shareCopied ? CheckIcon : ShareIcon}
                onClick={handleShareClick}
              >
                {shareCopied ? 'Link copied' : 'Share'}
              </Button>
            </div>

            {age && (
              <div className="grid gap-2 sm:grid-cols-2 mt-4">
                <div className="stat">
                  <p className="stat-label">Age</p>
                  <p className="stat-value">{age.formatted}</p>
                </div>
                <div className="stat">
                  <p className="stat-label">In numbers</p>
                  <p className="stat-value">
                    {age.totalDays} days · {age.totalWeeks} weeks · {age.totalMonths} months
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line pt-5 mt-5 flex flex-col gap-3">
          <ProgressBar completed={progress.completed} total={progress.total} percentage={progress.percentage} />
          <div className="flex items-center flex-wrap gap-2">
            <Badge tone="accent">{stage}</Badge>
            {overdueVaccines.length > 0 && (
              <Badge tone="danger">
                {overdueVaccines.length} vaccine{overdueVaccines.length > 1 ? 's' : ''} overdue
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div ref={tabsContainerRef} className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tab ${activeTab === tab.id ? 'tab-on' : ''}`}
            >
              <tab.icon className="w-[18px] h-[18px]" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'vaccines' && (
        <Card key="vaccines" className="motion-enter">
          <SectionHeader
            as="h2"
            title="Bangladesh EPI vaccine schedule"
            lead="Mark each dose as it is given. Dates are worked out from the date of birth."
          />
          <div className="card row-divider">
            {vaccines.map((vaccine) => (
              <VaccineCard
                key={vaccine.key}
                vaccine={vaccine}
                onToggle={handleVaccineToggle}
                isLoading={loadingVaccineKey === vaccine.key}
              />
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'milestones' && <MilestoneTracker key="milestones" />}

      {activeTab === 'growth' && <GrowthTracker key="growth" />}

      {activeTab === 'records' && (
        <Card key="records" className="motion-enter">
          <SectionHeader
            as="h2"
            title="Medical records"
            lead="Birth certificates, reports and prescriptions kept with the profile."
            aside={
              medicalRecords.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/edit-baby/${currentBaby.id}`)}
                >
                  Upload new
                </Button>
              )
            }
          />

          {medicalRecords.length === 0 ? (
            <EmptyState
              icon={DocumentIcon}
              title="No records uploaded yet"
              message="Keep scans and reports next to the vaccine history."
              action={
                <Button onClick={() => navigate(`/edit-baby/${currentBaby.id}`)}>Upload records</Button>
              }
            />
          ) : (
            <div className="card row-divider">
              {medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="icon-tile w-10 h-10 shrink-0">
                      <DocumentIcon className="w-5 h-5 text-ink-2" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{record.name}</p>
                      <p className="text-[13px] text-ink-2">
                        {formatFileSize(record.size)} · {new Date(record.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                    <a href={record.data} download={record.name} className="btn-icon" title="Download">
                      <ArrowDownTrayIcon className="w-[18px] h-[18px]" aria-hidden="true" />
                      <span className="sr-only">Download {record.name}</span>
                    </a>
                    {record.type.startsWith('image/') && (
                      <button
                        type="button"
                        onClick={() => handleViewRecord(record)}
                        className="btn-icon"
                        title="View"
                      >
                        <EyeIcon className="w-[18px] h-[18px]" aria-hidden="true" />
                        <span className="sr-only">View {record.name}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      className="btn-icon btn-icon-danger"
                      title="Delete"
                    >
                      <TrashIcon className="w-[18px] h-[18px]" aria-hidden="true" />
                      <span className="sr-only">Delete {record.name}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {overdueVaccines.length > 0 && activeTab === 'vaccines' && (
        <p className="flex items-center gap-2 text-[13px] text-ink-2 mt-4">
          <ExclamationTriangleIcon className="w-4 h-4 text-danger-fg" aria-hidden="true" />
          Overdue doses are still worth giving — ask your clinic about catch-up.
        </p>
      )}
    </AppShell>
  );
};

export default Dashboard;
