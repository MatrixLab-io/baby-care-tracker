import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calculateAge } from '../utils/ageCalculator';
import { getVaccineStatus, getVaccineProgress, getVaccinationStage } from '../utils/vaccineEngine';
import { sanitizeString, validateDob, validateBase64Json } from '../utils/validation';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Header from '../components/Header';
import { STATUS_COLORS, STATUS_ICONS } from '../config/vaccines';
import Footer from '../components/Footer';

const SharedView = () => {
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get('name');
  const dobParam = searchParams.get('dob');
  const vaccinesParam = searchParams.get('v');

  const [babyData, setBabyData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate and sanitize inputs
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
      vaccines: vaccinesValidation.value
    });
  }, [nameParam, dobParam, vaccinesParam]);

  if (!babyData || error) {
    return (
      <div className="min-h-screen gradient-mesh flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Invalid Share Link</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error || 'This share link is missing required information.'}
            </p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const age = calculateAge(babyData.dob);
  const vaccines = getVaccineStatus(babyData.dob, babyData.vaccines || {});
  const progress = getVaccineProgress(vaccines);
  const stage = getVaccinationStage(vaccines);

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <div className="max-w-4xl mx-auto p-4 py-8 flex-1 w-full">
        {/* Header */}
        <Header />

        {/* Page Title */}
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{babyData.name}</h2>
            {age && (
              <div className="text-gray-600 dark:text-gray-300">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{age.formatted}</p>
                <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                  {age.totalDays} days • {age.totalWeeks} weeks • {age.totalMonths} months
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <ProgressBar
              completed={progress.completed}
              total={progress.total}
              percentage={progress.percentage}
            />
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {stage}
              </span>
            </div>
          </div>
        </Card>

        {/* Vaccines */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Vaccine Schedule
          </h2>
          <div className="space-y-3">
            {vaccines.map(vaccine => (
              <div
                key={vaccine.key}
                className="border-l-4 border-gray-300 dark:border-gray-600 p-4 rounded-r-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{STATUS_ICONS[vaccine.status]}</span>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{vaccine.label}</h3>
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-2 text-xs">
                        <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium">
                          {vaccine.ageLabel}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {vaccine.ageDays}
                        </span>
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
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
        <Card className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
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
