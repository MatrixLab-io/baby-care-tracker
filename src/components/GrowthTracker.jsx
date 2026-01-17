import { useState } from 'react';
import { PlusIcon, TrashIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useBaby } from '../context/BabyContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import DatePicker from './DatePicker';
import Modal from './Modal';

const GrowthTracker = () => {
  const { currentBaby, addGrowthRecord, deleteGrowthRecord } = useBaby();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: ''
  });

  if (!currentBaby) return null;

  const growthRecords = currentBaby.growthRecords || [];

  const handleAddRecord = () => {
    if (!newRecord.weight && !newRecord.height && !newRecord.headCircumference) return;

    addGrowthRecord({
      date: newRecord.date,
      weight: parseFloat(newRecord.weight) || null,
      height: parseFloat(newRecord.height) || null,
      headCircumference: parseFloat(newRecord.headCircumference) || null
    });

    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      headCircumference: ''
    });

    setIsModalOpen(false);
  };

  const chartData = growthRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: record.weight,
    height: record.height,
    head: record.headCircumference
  }));

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Growth Tracker</h2>
        <Button size="sm" icon={PlusIcon} onClick={() => setIsModalOpen(true)}>
          Add Record
        </Button>
      </div>

      {growthRecords.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <ChartBarIcon className="w-20 h-20 mx-auto mb-4 text-indigo-500 dark:text-indigo-400" />
          <p className="text-lg">No growth records yet. Add your first measurement!</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="glass-card p-4 rounded-xl mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" strokeWidth={2} />
                <Line type="monotone" dataKey="height" stroke="#10b981" name="Height (cm)" strokeWidth={2} />
                <Line type="monotone" dataKey="head" stroke="#f59e0b" name="Head (cm)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="glass-card">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Weight (kg)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Height (cm)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Head (cm)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {growthRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`${index % 2 === 0 ? 'glass' : ''} hover:glass-card transition-all`}
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{record.weight || '-'}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{record.height || '-'}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{record.headCircumference || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteGrowthRecord(record.id)}
                        className="glass-card p-2 rounded-lg hover:scale-110 transition-transform cursor-pointer delete-icon"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Growth Record"
        size="md"
      >
        <div className="space-y-3">
          <DatePicker
            label="Date"
            value={newRecord.date}
            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
            placeholder="Select date"
          />
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            value={newRecord.weight}
            onChange={(e) => setNewRecord({ ...newRecord, weight: e.target.value })}
            placeholder="e.g., 3.5"
          />
          <Input
            label="Height (cm)"
            type="number"
            step="0.1"
            value={newRecord.height}
            onChange={(e) => setNewRecord({ ...newRecord, height: e.target.value })}
            placeholder="e.g., 50.5"
          />
          <Input
            label="Head Circumference (cm)"
            type="number"
            step="0.1"
            value={newRecord.headCircumference}
            onChange={(e) => setNewRecord({ ...newRecord, headCircumference: e.target.value })}
            placeholder="e.g., 35.0"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleAddRecord} icon={PlusIcon} fullWidth>
              Add Record
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default GrowthTracker;
