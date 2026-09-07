import { useState } from 'react';
import { ArrowPathIcon, ChartBarIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import Button from './ui/Button';
import Card from './ui/Card';
import EmptyState from './ui/EmptyState';
import Modal from './ui/Modal';
import SectionHeader from './ui/SectionHeader';
import { Field } from './ui/FormField';
import DatePicker from './DatePicker';
import GrowthChart from './GrowthChart';

const today = () => new Date().toISOString().split('T')[0];
const EMPTY_RECORD = { date: today(), weight: '', height: '', headCircumference: '' };

const GrowthTracker = () => {
  const { currentBaby, addGrowthRecord, deleteGrowthRecord } = useBaby();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newRecord, setNewRecord] = useState(EMPTY_RECORD);

  if (!currentBaby) return null;

  const growthRecords = currentBaby.growthRecords || [];

  const handleAddRecord = async () => {
    if (!newRecord.weight && !newRecord.height && !newRecord.headCircumference) return;

    setIsAdding(true);
    try {
      await addGrowthRecord({
        date: newRecord.date,
        weight: parseFloat(newRecord.weight) || null,
        height: parseFloat(newRecord.height) || null,
        headCircumference: parseFloat(newRecord.headCircumference) || null,
      });
      setNewRecord({ ...EMPTY_RECORD, date: today() });
      setIsModalOpen(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    setDeletingId(recordId);
    try {
      await deleteGrowthRecord(recordId);
    } finally {
      setDeletingId(null);
    }
  };

  const chartData = growthRecords.map((record) => ({
    date: record.date,
    weight: record.weight,
    height: record.height,
    head: record.headCircumference,
  }));

  return (
    <Card>
      <SectionHeader
        title="Growth"
        lead="Weight, height and head circumference over time."
        aside={
          <Button size="sm" icon={PlusIcon} onClick={() => setIsModalOpen(true)}>
            Add record
          </Button>
        }
      />

      {growthRecords.length === 0 ? (
        <EmptyState
          icon={ChartBarIcon}
          title="No growth records yet"
          message="Add a measurement and the chart starts filling in."
          action={
            <Button icon={PlusIcon} onClick={() => setIsModalOpen(true)}>
              Add first record
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="card p-4">
            <GrowthChart data={chartData} />
          </div>

          <div className="card overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Height (cm)</th>
                  <th>Head (cm)</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {growthRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="tabular-nums">{record.weight ?? '—'}</td>
                    <td className="tabular-nums">{record.height ?? '—'}</td>
                    <td className="tabular-nums">{record.headCircumference ?? '—'}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(record.id)}
                        disabled={deletingId === record.id}
                        className="btn-icon btn-icon-danger"
                        aria-label="Delete record"
                      >
                        {deletingId === record.id ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <TrashIcon className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add growth record"
        description="Fill in whatever you measured — all three are optional."
        size="sm"
        dismissable={!isAdding}
      >
        <div className="flex flex-col gap-4">
          <DatePicker
            label="Date"
            name="growth-date"
            value={newRecord.date}
            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
          />
          <Field
            label="Weight (kg)"
            name="weight"
            type="number"
            step="0.1"
            value={newRecord.weight}
            onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
            placeholder="3.5"
          />
          <Field
            label="Height (cm)"
            name="height"
            type="number"
            step="0.1"
            value={newRecord.height}
            onChange={(e) => setNewRecord({ ...newRecord, height: e.target.value })}
            placeholder="50.5"
          />
          <Field
            label="Head circumference (cm)"
            name="headCircumference"
            type="number"
            step="0.1"
            value={newRecord.headCircumference}
            onChange={(e) => setNewRecord({ ...newRecord, headCircumference: e.target.value })}
            placeholder="35.0"
          />
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth disabled={isAdding}>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} icon={isAdding ? ArrowPathIcon : PlusIcon} loading={isAdding} fullWidth>
              {isAdding ? 'Adding' : 'Add record'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default GrowthTracker;
