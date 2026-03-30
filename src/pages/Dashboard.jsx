import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShareIcon,
  TrophyIcon,
  ChartBarIcon,
  DocumentTextIcon,
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import { getVaccineStatus, getVaccineProgress, getVaccinationStage, getOverdueVaccines, getPrivateVaccineStatus, getCombinedProgress } from '../utils/vaccineEngine';
import Card from '../components/Card';
import Button from '../components/Button';
import VaccineCard from '../components/VaccineCard';
import ProgressBar from '../components/ProgressBar';
import MilestoneTracker from '../components/MilestoneTracker';
import GrowthTracker from '../components/GrowthTracker';
import Header from '../components/Header';
import { CardLoader } from '../components/LoadingCard';
import OutbreakAlert from '../components/OutbreakAlert';
import Footer from '../components/Footer';

const TABS = [
  { id: 'vaccines', label: 'Vaccines', icon: null, emoji: '💉' },
  { id: 'milestones', label: 'Milestones', icon: TrophyIcon },
  { id: 'growth', label: 'Growth', icon: ChartBarIcon },
  { id: 'records', label: 'Records', icon: DocumentTextIcon }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentBaby, babies, switchBaby, toggleVaccineStatus, deleteMedicalRecord, loading } = useBaby();
  const [activeTab, setActiveTab] = useState('vaccines');
  const [loadingVaccineKey, setLoadingVaccineKey] = useState(null);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Auto-scroll to show the clicked tab
    const tabElement = tabRefs.current[tabId];
    const container = tabsContainerRef.current;

    if (tabElement && container) {
      const tabIndex = TABS.findIndex(t => t.id === tabId);

      if (tabIndex === 0) {
        // First tab - scroll to start
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (tabIndex === TABS.length - 1) {
        // Last tab - scroll to end
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      } else {
        // Middle tabs - center the tab
        const containerRect = container.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        const scrollLeft = tabElement.offsetLeft - (containerRect.width / 2) + (tabRect.width / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDeleteRecord = (recordId) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      deleteMedicalRecord(recordId);
    }
  };

  const handleViewRecord = (record) => {
    // Convert base64 data URL to blob URL for viewing
    const byteString = atob(record.data.split(',')[1]);
    const mimeType = record.type;
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh flex flex-col">
        <div className="max-w-5xl mx-auto p-4 pt-8 flex-1">
          <CardLoader />
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentBaby) {
    return (
      <div className="min-h-screen gradient-mesh flex flex-col">
        <div className="max-w-5xl mx-auto p-4 pt-8 flex-1">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">No baby selected</h2>
            <Button onClick={() => navigate('/')} icon={ArrowLeftIcon}>Go to Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const age = calculateAge(currentBaby.dob);
  const vaccines = getVaccineStatus(currentBaby.dob, currentBaby.vaccines);
  const privateVaccines = getPrivateVaccineStatus(currentBaby.dob, currentBaby.vaccines);
  const progress = getVaccineProgress(vaccines);
  const privateProgress = getVaccineProgress(privateVaccines);
  const combinedProgress = getCombinedProgress(vaccines, privateVaccines);
  const stage = getVaccinationStage(vaccines);
  const overdueVaccines = getOverdueVaccines(vaccines);
  const overduePrivateVaccines = getOverdueVaccines(privateVaccines);

  const handleShareClick = () => {
    // Encode vaccines data for sharing
    const vaccinesData = currentBaby.vaccines ? btoa(JSON.stringify(currentBaby.vaccines)) : '';
    const shareUrl = `${window.location.origin}/share?name=${encodeURIComponent(currentBaby.name)}&dob=${currentBaby.dob}&v=${vaccinesData}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleVaccineToggle = async (vaccineKey) => {
    setLoadingVaccineKey(vaccineKey);
    try {
      await toggleVaccineStatus(vaccineKey);
    } finally {
      setLoadingVaccineKey(null);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="max-w-5xl mx-auto p-4 py-6 flex-1 w-full">
        {/* Header */}
        <Header
          showBack
          backIcon
        />

        {/* Baby Selector */}
        {babies.length > 1 && (
          <div className="mb-6">
            <select
              value={currentBaby.id}
              onChange={(e) => switchBaby(e.target.value)}
              className="glass-card border border-white/10 w-full md:w-auto px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium cursor-pointer"
            >
              {babies.map(baby => (
                <option key={baby.id} value={baby.id}>
                  {baby.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Outbreak Alerts */}
        <OutbreakAlert completedVaccines={currentBaby.vaccines || {}} />

        {/* Baby Info Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
            <div className="relative">
              {currentBaby.photo ? (
                <img
                  src={currentBaby.photo}
                  alt={currentBaby.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-white/50 dark:ring-gray-700/50 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/50 dark:ring-gray-700/50 shrink-0">
                  {currentBaby.name.charAt(0).toUpperCase()}
                </div>
              )}
              {/* Share button on avatar */}
              <button
                onClick={handleShareClick}
                className="absolute -bottom-1 -right-1 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg transition-colors"
                title="Share"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 truncate">
                {currentBaby.name}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                {currentBaby.gender && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {currentBaby.gender === 'male' ? '👦 Boy' : '👧 Girl'}
                  </span>
                )}
                {currentBaby.bloodGroup && (
                  <span className="px-2 py-1 text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                    🩸 {currentBaby.bloodGroup}
                  </span>
                )}
              </div>
              {age && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-sm">
                  <div className="glass border border-white/10 px-3 sm:px-4 py-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Age: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{age.formatted}</span>
                  </div>
                  <div className="glass border border-white/10 px-3 sm:px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400">
                    {age.totalDays} days • {age.totalWeeks} weeks • {age.totalMonths} months
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <ProgressBar
              completed={combinedProgress.completed}
              total={combinedProgress.total}
              percentage={combinedProgress.percentage}
              label="Overall Vaccination Progress"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                EPI: {progress.completed}/{progress.total}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                Private: {privateProgress.completed}/{privateProgress.total}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300 glass border border-white/10 px-4 py-2 rounded-full font-medium">
                {stage}
              </span>
              {(overdueVaccines.length + overduePrivateVaccines.length) > 0 && (
                <span className="text-sm text-red-600 dark:text-red-400 glass border border-white/10 px-4 py-2 rounded-full font-medium">
                  ⚠️ {overdueVaccines.length + overduePrivateVaccines.length} vaccine{(overdueVaccines.length + overduePrivateVaccines.length) > 1 ? 's' : ''} overdue
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div
          ref={tabsContainerRef}
          className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide"
        >
          <div className="glass-card border border-white/10 p-1 rounded-xl inline-flex gap-1 min-w-max">
            {TABS.map(tab => (
              <button
                key={tab.id}
                ref={el => tabRefs.current[tab.id] = el}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap outline-none focus:outline-none ${
                  activeTab === tab.id
                    ? 'glass-card border border-white/10 text-indigo-600 dark:text-indigo-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.emoji ? (
                  <span className="text-lg sm:text-xl">{tab.emoji}</span>
                ) : (
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'vaccines' && (
          <div className="space-y-6">
            {/* EPI Vaccines */}
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Bangladesh EPI Vaccine Schedule
                </h2>
                <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                  Government
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Expanded Programme on Immunization ({progress.completed}/{progress.total} completed)
              </p>
              <div className="space-y-4">
                {vaccines.map(vaccine => (
                  <VaccineCard
                    key={vaccine.key}
                    vaccine={vaccine}
                    onToggle={handleVaccineToggle}
                    isLoading={loadingVaccineKey === vaccine.key}
                  />
                ))}
              </div>
            </Card>

            {/* Private Vaccines */}
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Private Vaccination Schedule
                </h2>
                <span className="px-2.5 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                  Private
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Additional recommended vaccines ({privateProgress.completed}/{privateProgress.total} completed)
              </p>
              <div className="space-y-4">
                {privateVaccines.map(vaccine => (
                  <VaccineCard
                    key={vaccine.key}
                    vaccine={vaccine}
                    onToggle={handleVaccineToggle}
                    isLoading={loadingVaccineKey === vaccine.key}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'milestones' && <MilestoneTracker />}

        {activeTab === 'growth' && <GrowthTracker />}

        {activeTab === 'records' && (
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Medical Records
              </h2>
              {currentBaby.medicalRecords?.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/edit-baby/${currentBaby.id}`)}
                >
                  Upload New
                </Button>
              )}
            </div>

            {(!currentBaby.medicalRecords || currentBaby.medicalRecords.length === 0) ? (
              <div className="text-center py-12">
                <DocumentIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No medical records uploaded yet</p>
                <Button
                  size="sm"
                  onClick={() => navigate(`/edit-baby/${currentBaby.id}`)}
                >
                  Upload Records
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentBaby.medicalRecords.map(record => (
                  <div key={record.id} className="glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${
                        record.type === 'application/pdf'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <DocumentIcon className={`w-6 h-6 ${
                          record.type === 'application/pdf'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{record.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(record.size)} • {new Date(record.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <a
                        href={record.data}
                        download={record.name}
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </a>
                      {record.type.startsWith('image/') && (
                        <button
                          onClick={() => handleViewRecord(record)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer"
                          title="View"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
