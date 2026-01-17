import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShareIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import { getVaccineStatus, getVaccineProgress, getVaccinationStage, getOverdueVaccines } from '../utils/vaccineEngine';
import Card from '../components/Card';
import Button from '../components/Button';
import VaccineCard from '../components/VaccineCard';
import ProgressBar from '../components/ProgressBar';
import MilestoneTracker from '../components/MilestoneTracker';
import GrowthTracker from '../components/GrowthTracker';
import ThemeToggle from '../components/ThemeToggle';
import { CardLoader } from '../components/LoadingCard';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentBaby, babies, switchBaby, toggleVaccineStatus, loading } = useBaby();
  const [activeTab, setActiveTab] = useState('vaccines');

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh">
        <div className="max-w-5xl mx-auto p-4 pt-8">
          <CardLoader />
        </div>
      </div>
    );
  }

  if (!currentBaby) {
    return (
      <div className="min-h-screen gradient-mesh">
        <div className="max-w-5xl mx-auto p-4 pt-8">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">No baby selected</h2>
            <Button onClick={() => navigate('/')} icon={ArrowLeftIcon}>Go to Home</Button>
          </Card>
        </div>
      </div>
    );
  }

  const age = calculateAge(currentBaby.dob);
  const vaccines = getVaccineStatus(currentBaby.dob, currentBaby.vaccines);
  const progress = getVaccineProgress(vaccines);
  const stage = getVaccinationStage(vaccines);
  const overdueVaccines = getOverdueVaccines(vaccines);

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/share?name=${encodeURIComponent(currentBaby.name)}&dob=${currentBaby.dob}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-5xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="secondary" size="sm" icon={ArrowLeftIcon} onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" icon={ShareIcon} onClick={handleShareClick}>
              Share
            </Button>
          </div>
        </div>

        {/* Baby Selector */}
        {babies.length > 1 && (
          <div className="mb-6">
            <select
              value={currentBaby.id}
              onChange={(e) => switchBaby(e.target.value)}
              className="glass-card w-full md:w-auto px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-medium cursor-pointer"
            >
              {babies.map(baby => (
                <option key={baby.id} value={baby.id}>
                  {baby.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Baby Info Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-6 mb-6">
            {currentBaby.photo ? (
              <img
                src={currentBaby.photo}
                alt={currentBaby.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/50 dark:ring-gray-700/50"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/50 dark:ring-gray-700/50">
                {currentBaby.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {currentBaby.name}
              </h1>
              {currentBaby.gender && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {currentBaby.gender === 'male' ? '👦 Boy' : '👧 Girl'}
                </p>
              )}
              {age && (
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="glass px-4 py-2 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Age: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{age.formatted}</span>
                  </div>
                  <div className="glass px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400">
                    {age.totalDays} days • {age.totalWeeks} weeks • {age.totalMonths} months
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <ProgressBar
              completed={progress.completed}
              total={progress.total}
              percentage={progress.percentage}
            />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300 glass px-4 py-2 rounded-full font-medium">
                {stage}
              </span>
              {overdueVaccines.length > 0 && (
                <span className="text-sm text-red-600 dark:text-red-400 glass px-4 py-2 rounded-full font-medium border border-red-200 dark:border-red-800">
                  ⚠️ {overdueVaccines.length} vaccine{overdueVaccines.length > 1 ? 's' : ''} overdue
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="glass-card p-1 rounded-xl inline-flex gap-1">
            {[
              { id: 'vaccines', label: 'Vaccines', icon: null, emoji: '💉' },
              { id: 'milestones', label: 'Milestones', icon: TrophyIcon },
              { id: 'growth', label: 'Growth', icon: ChartBarIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'glass-card text-indigo-600 dark:text-indigo-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.emoji ? (
                  <span className="text-xl">{tab.emoji}</span>
                ) : (
                  <tab.icon className="w-5 h-5" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'vaccines' && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Bangladesh EPI Vaccine Schedule
              </h2>
              <div className="space-y-4">
                {vaccines.map(vaccine => (
                  <VaccineCard
                    key={vaccine.key}
                    vaccine={vaccine}
                    onToggle={toggleVaccineStatus}
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'milestones' && <MilestoneTracker />}

        {activeTab === 'growth' && <GrowthTracker />}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
