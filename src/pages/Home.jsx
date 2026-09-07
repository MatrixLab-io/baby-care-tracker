import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarSquareIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import AppShell from '../components/AppShell';
import { HomeLoader } from '../components/LoadingCard';
import Alert from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import { BoyIcon, GirlIcon } from '../components/ui/GlyphIcons';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

const GENDER = {
  male: { label: 'Boy', icon: BoyIcon },
  female: { label: 'Girl', icon: GirlIcon },
};

const Home = () => {
  const navigate = useNavigate();
  const { babies, loading, switchBaby, deleteBaby } = useBaby();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, baby: null });

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
      <AppShell>
        <HomeLoader />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-3 mb-8 motion-rise">
        <span className="eyebrow">Bangladesh EPI schedule</span>
        <h1 className="text-3xl sm:text-[34px] font-bold">Baby care &amp; vaccine tracker</h1>
        <p className="text-[15px] text-ink-2 max-w-xl">
          Vaccines, growth and milestones for every child in your care, in one place.
        </p>
      </div>

      {babies.length === 0 ? (
        <Card>
          <EmptyState
            icon={UserPlusIcon}
            title="No babies added yet"
            message="Add a profile to start tracking vaccines, growth and milestones."
            action={
              <Button icon={PlusIcon} size="lg" onClick={() => navigate('/add-baby')}>
                Add your first baby
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            {babies.map((baby) => {
              const age = calculateAge(baby.dob);

              return (
                <Card key={baby.id} as="article" lift className="flex flex-col gap-4 motion-enter">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar src={baby.photo} name={baby.name} size="xl" />
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-ink truncate">{baby.name}</h2>
                      {baby.gender && (
                        <div className="mt-1.5">
                          <Badge tone="neutral" icon={GENDER[baby.gender].icon}>
                            {GENDER[baby.gender].label}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {age && (
                    <div className="stat">
                      <p className="stat-label">Age</p>
                      <p className="text-[17px] font-bold text-ink mt-0.5">{age.formatted}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge tone="neutral">{age.totalDays} days</Badge>
                        <Badge tone="neutral">{age.totalWeeks} weeks</Badge>
                        <Badge tone="neutral">{age.totalMonths} months</Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-auto">
                    <Button icon={ChartBarSquareIcon} onClick={() => handleBabyClick(baby)} fullWidth>
                      View dashboard
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        icon={PencilIcon}
                        onClick={() => navigate(`/edit-baby/${baby.id}`)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        icon={TrashIcon}
                        onClick={() => setDeleteModal({ isOpen: true, baby })}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Button variant="secondary" icon={PlusIcon} size="lg" fullWidth onClick={() => navigate('/add-baby')}>
            Add another baby
          </Button>
        </div>
      )}

      <Alert tone="caution" icon={ExclamationTriangleIcon} title="Medical disclaimer" className="mt-8">
        This app follows the Bangladesh EPI schedule. Always consult a qualified healthcare professional for
        medical advice and vaccination guidance.
      </Alert>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, baby: null })}
        title="Delete baby profile"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Alert tone="danger" title="This cannot be undone">
            Deleting <span className="font-semibold">{deleteModal.baby?.name}</span> removes their vaccines,
            milestones, growth records and uploaded documents.
          </Alert>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, baby: null })}>
              Cancel
            </Button>
            <Button variant="danger" icon={TrashIcon} onClick={handleDeleteConfirm}>
              Delete profile
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
};

export default Home;
