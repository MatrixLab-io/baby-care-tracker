import { useState } from 'react';
import {
  ArrowPathIcon,
  CakeIcon,
  CheckBadgeIcon,
  GiftIcon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import Modal from './ui/Modal';
import SectionHeader from './ui/SectionHeader';
import { Field } from './ui/FormField';
import DatePicker from './DatePicker';

// Each milestone gets its own tint so the six tiles are told apart at a glance.
// These are the categorical tokens, not the status ones — see tokens.css.
const AUTO_MILESTONES = [
  { days: 7, label: '1 week old', icon: SparklesIcon, tone: 'tile-cat-1' },
  { days: 45, label: '45 days old', icon: StarIcon, tone: 'tile-cat-2' },
  { days: 90, label: '3 months old', icon: SunIcon, tone: 'tile-cat-3' },
  { days: 180, label: '6 months old', icon: CheckBadgeIcon, tone: 'tile-cat-4' },
  { days: 270, label: '9 months old', icon: GiftIcon, tone: 'tile-cat-5' },
  { days: 365, label: '1 year old', icon: CakeIcon, tone: 'tile-cat-6' },
];

const today = () => new Date().toISOString().split('T')[0];

const MilestoneTracker = () => {
  const { currentBaby, addMilestone, deleteMilestone } = useBaby();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', date: today() });

  if (!currentBaby) return null;

  const age = calculateAge(currentBaby.dob);
  const customMilestones = currentBaby.milestones || [];

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim()) return;

    setIsAdding(true);
    try {
      await addMilestone({
        title: newMilestone.title,
        description: newMilestone.description,
        date: newMilestone.date,
        isCustom: true,
      });
      setNewMilestone({ title: '', description: '', date: today() });
      setIsModalOpen(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    setDeletingId(milestoneId);
    try {
      await deleteMilestone(milestoneId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <SectionHeader
        title="Milestones"
        lead="Age milestones tick over on their own. Add the ones only you would know."
        aside={
          <Button size="sm" icon={PlusIcon} onClick={() => setIsModalOpen(true)}>
            Add custom
          </Button>
        }
      />

      <div className="mb-6">
        <span className="eyebrow">Age milestones</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {AUTO_MILESTONES.map((milestone) => {
            const achieved = age && age.totalDays >= milestone.days;
            const Icon = milestone.icon;
            return (
              <div
                key={milestone.days}
                className={`card shadow-soft p-4 flex flex-col items-center text-center gap-2 transition-[box-shadow,translate] duration-200 ${
                  achieved ? 'hover:-translate-y-0.5 hover:shadow-lift' : 'opacity-60'
                }`}
              >
                <span className={`icon-tile w-11 h-11 ${achieved ? milestone.tone : ''}`}>
                  <Icon className="w-[22px] h-[22px]" aria-hidden="true" />
                </span>
                <span className="text-[13px] font-medium text-ink">{milestone.label}</span>
                {achieved ? <Badge tone="live">Achieved</Badge> : <Badge tone="neutral">Not yet</Badge>}
              </div>
            );
          })}
        </div>
      </div>

      {customMilestones.length > 0 && (
        <div>
          <span className="eyebrow">Custom milestones</span>
          <div className="card row-divider mt-3">
            {customMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start justify-between gap-3 p-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="icon-tile w-9 h-9 shrink-0 bg-accent-soft text-accent-soft-fg">
                    <TrophyIcon className="w-[18px] h-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink">{milestone.title}</h3>
                    {milestone.description && (
                      <p className="text-[13px] text-ink-2 mt-0.5">{milestone.description}</p>
                    )}
                    <p className="text-xs text-ink-3 mt-1">{new Date(milestone.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMilestone(milestone.id)}
                  disabled={deletingId === milestone.id}
                  className="btn-icon btn-icon-danger shrink-0"
                  aria-label={`Delete ${milestone.title}`}
                >
                  {deletingId === milestone.id ? (
                    <ArrowPathIcon className="w-[18px] h-[18px] animate-spin" aria-hidden="true" />
                  ) : (
                    <TrashIcon className="w-[18px] h-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add custom milestone"
        size="sm"
        dismissable={!isAdding}
      >
        <div className="flex flex-col gap-4">
          <Field
            label="Milestone"
            name="milestone-title"
            required
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="First smile, first step…"
          />
          <Field
            label="Description"
            name="milestone-description"
            help="Optional."
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            placeholder="Add a detail worth remembering"
          />
          <DatePicker
            label="Date"
            name="milestone-date"
            value={newMilestone.date}
            onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
          />
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth disabled={isAdding}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMilestone}
              icon={isAdding ? ArrowPathIcon : PlusIcon}
              loading={isAdding}
              fullWidth
            >
              {isAdding ? 'Adding' : 'Add milestone'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default MilestoneTracker;
