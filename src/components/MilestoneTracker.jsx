import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { calculateAge } from '../utils/ageCalculator';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import DatePicker from './DatePicker';
import Modal from './Modal';

const AUTO_MILESTONES = [
  { days: 7, label: '1 Week Old', icon: '🎉' },
  { days: 45, label: '45 Days Old', icon: '🌟' },
  { days: 90, label: '3 Months Old', icon: '🎊' },
  { days: 180, label: '6 Months Old', icon: '🎈' },
  { days: 270, label: '9 Months Old', icon: '🎁' },
  { days: 365, label: '1 Year Old', icon: '🎂' }
];

const MilestoneTracker = () => {
  const { currentBaby, addMilestone, deleteMilestone } = useBaby();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!currentBaby) return null;

  const age = calculateAge(currentBaby.dob);
  const achievedAutoMilestones = AUTO_MILESTONES.filter(
    milestone => age && age.totalDays >= milestone.days
  );

  const customMilestones = currentBaby.milestones || [];

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim()) return;

    addMilestone({
      title: newMilestone.title,
      description: newMilestone.description,
      date: newMilestone.date,
      isCustom: true
    });

    setNewMilestone({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Milestones</h2>
        <Button size="sm" icon={PlusIcon} onClick={() => setIsModalOpen(true)}>
          Add Custom
        </Button>
      </div>

      {/* Auto Milestones */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Age Milestones</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AUTO_MILESTONES.map((milestone) => {
            const achieved = age && age.totalDays >= milestone.days;
            return (
              <div
                key={milestone.days}
                className={`glass-card p-4 rounded-xl text-center transition-all ${
                  achieved
                    ? 'border-2 border-green-400 dark:border-green-600'
                    : 'opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{milestone.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {milestone.label}
                </div>
                {achieved && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Achieved</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Milestones */}
      {customMilestones.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Custom Milestones</h3>
          <div className="space-y-3">
            {customMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="glass-card p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-start justify-between hover:scale-[1.01] transition-transform"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h4>
                  {milestone.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{milestone.description}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {new Date(milestone.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteMilestone(milestone.id)}
                  className="glass-card p-2 rounded-lg hover:scale-110 transition-transform cursor-pointer delete-icon"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Custom Milestone"
      >
        <Input
          label="Milestone Title"
          value={newMilestone.title}
          onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
          placeholder="e.g., First smile, First step"
          required
        />
        <Input
          label="Description (Optional)"
          value={newMilestone.description}
          onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
          placeholder="Add details about this milestone"
        />
        <DatePicker
          label="Date"
          value={newMilestone.date}
          onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
          placeholder="Select date"
        />
        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleAddMilestone} icon={PlusIcon} fullWidth>
            Add Milestone
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default MilestoneTracker;
