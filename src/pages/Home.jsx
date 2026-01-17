import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';
import { ListLoader } from '../components/LoadingCard';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const { babies, loading, switchBaby, deleteBaby } = useBaby();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, baby: null });

  const handleDeleteClick = (baby) => {
    setDeleteModal({ isOpen: true, baby });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.baby) {
      deleteBaby(deleteModal.baby.id);
      setDeleteModal({ isOpen: false, baby: null });
    }
  };

  const handleBabyClick = (baby) => {
    switchBaby(baby.id);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-mesh">
        <div className="max-w-4xl mx-auto p-4 pt-8">
          <ListLoader rows={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="text-6xl mb-4">👶</div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
            Baby Care & Vaccine Tracker
          </h1>
          <p className="text-xl text-gray-800 dark:text-white/90 mb-2">Track your baby's growth, vaccines, and milestones</p>
          <p className="text-sm text-gray-600 dark:text-white/70 italic">
            Based on Bangladesh EPI Schedule
          </p>
        </div>

        {/* Baby List */}
        {babies.length === 0 ? (
          <Card className="text-center py-16">
            <div className="text-6xl mb-6">🍼</div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              No babies added yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Add your baby's profile to start tracking vaccines and milestones
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/add-baby')} icon={PlusIcon} size="lg">
                Add Your First Baby
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {babies.map((baby) => {
                const age = calculateAge(baby.dob);

                return (
                  <Card key={baby.id}>
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {baby.photo ? (
                            <img
                              src={baby.photo}
                              alt={baby.name}
                              className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50 dark:ring-gray-700/50"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/50 dark:ring-gray-700/50">
                              {baby.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                              {baby.name}
                            </h3>
                            {baby.gender && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {baby.gender === 'male' ? '👦 Boy' : '👧 Girl'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {age && (
                        <div className="glass rounded-xl p-4 mb-4 border border-white/20">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">Age</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {age.formatted}
                          </p>
                          <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="glass px-2 py-1 rounded">{age.totalDays} days</span>
                            <span className="glass px-2 py-1 rounded">{age.totalWeeks} weeks</span>
                            <span className="glass px-2 py-1 rounded">{age.totalMonths} months</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={ChartBarSquareIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBabyClick(baby);
                          }}
                          fullWidth
                        >
                          View Dashboard
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={PencilIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-baby/${baby.id}`);
                            }}
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={TrashIcon}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(baby);
                            }}
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button onClick={() => navigate('/add-baby')} icon={PlusIcon} fullWidth size="lg">
              Add Another Baby
            </Button>
          </>
        )}

        {/* Medical Disclaimer */}
        <Card className="mt-8 bg-amber-100/90 dark:bg-amber-900/30 backdrop-blur-xl border-amber-300 dark:border-amber-700">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-lg">Medical Disclaimer</h4>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                This app follows the Bangladesh EPI schedule. Always consult with a qualified
                healthcare professional for medical advice and vaccination guidance.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, baby: null })}
        title="Delete Baby Profile"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete <strong>{deleteModal.baby?.name}'s</strong> profile?
          This action cannot be undone and will remove all data including vaccines, milestones,
          and growth records.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, baby: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" icon={TrashIcon} onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Home;
