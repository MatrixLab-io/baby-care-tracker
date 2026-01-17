import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calculateAge } from '../utils/ageCalculator';
import { getVaccineStatus, getVaccineProgress, getVaccinationStage } from '../utils/vaccineEngine';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { STATUS_COLORS, STATUS_ICONS } from '../config/vaccines';
import Footer from '../components/Footer';

const SharedView = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const dob = searchParams.get('dob');

  const [babyData, setBabyData] = useState(null);

  useEffect(() => {
    if (name && dob) {
      setBabyData({ name, dob });
    }
  }, [name, dob]);

  if (!babyData) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Invalid Share Link</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This share link is missing required information.
          </p>
        </Card>
      </div>
    );
  }

  const age = calculateAge(babyData.dob);
  const vaccines = getVaccineStatus(babyData.dob, {});
  const progress = getVaccineProgress(vaccines);
  const stage = getVaccinationStage(vaccines);

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block glass-card text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Read-Only View
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {babyData.name}'s Vaccine Schedule
          </h1>
          <p className="text-gray-700 dark:text-gray-300">Based on Bangladesh EPI Schedule</p>
        </div>

        {/* Baby Info */}
        <Card className="mb-6">
          <div className="text-center mb-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold mb-3">
              {babyData.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{babyData.name}</h2>
            {age && (
              <div className="text-gray-600">
                <p className="text-lg font-semibold">{age.formatted}</p>
                <p className="text-sm mt-1">
                  {age.totalDays} days • {age.totalWeeks} weeks • {age.totalMonths} months
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <ProgressBar
              completed={progress.completed}
              total={progress.total}
              percentage={progress.percentage}
            />
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                {stage}
              </span>
            </div>
          </div>
        </Card>

        {/* Vaccines */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Vaccine Schedule
          </h2>
          <div className="space-y-3">
            {vaccines.map(vaccine => (
              <div
                key={vaccine.key}
                className="border-l-4 border-gray-300 p-4 rounded-r-lg bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{STATUS_ICONS[vaccine.status]}</span>
                      <h3 className="font-semibold text-gray-900">{vaccine.label}</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Due Date:</span> {vaccine.dueDate}
                      </p>
                      <p className={`text-sm font-medium inline-block px-2 py-1 rounded ${STATUS_COLORS[vaccine.status]}`}>
                        {vaccine.statusMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-gray-700">
                This app follows the Bangladesh EPI schedule. Always consult with a qualified
                healthcare professional for medical advice and vaccination guidance.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SharedView;
