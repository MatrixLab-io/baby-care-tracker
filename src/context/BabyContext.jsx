import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAllBabies,
  addBaby as addBabyToStorage,
  updateBaby as updateBabyInStorage,
  deleteBaby as deleteBabyFromStorage,
  toggleVaccine,
  addMilestone as addMilestoneToStorage,
  deleteMilestone as deleteMilestoneFromStorage,
  addGrowthRecord as addGrowthRecordToStorage,
  deleteGrowthRecord as deleteGrowthRecordFromStorage
} from '../utils/storage';

const BabyContext = createContext();

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};

export const BabyProvider = ({ children }) => {
  const [babies, setBabies] = useState([]);
  const [currentBabyId, setCurrentBabyId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBabies();
  }, []);

  const loadBabies = () => {
    setLoading(true);
    const allBabies = getAllBabies();
    setBabies(allBabies);

    if (allBabies.length > 0 && !currentBabyId) {
      setCurrentBabyId(allBabies[0].id);
    }

    setLoading(false);
  };

  const currentBaby = babies.find(baby => baby.id === currentBabyId);

  const addBaby = (babyData) => {
    const newBaby = addBabyToStorage(babyData);
    setBabies([...babies, newBaby]);
    setCurrentBabyId(newBaby.id);
    return newBaby;
  };

  const updateBaby = (id, updates) => {
    const updated = updateBabyInStorage(id, updates);
    if (updated) {
      setBabies(babies.map(baby => baby.id === id ? updated : baby));
    }
    return updated;
  };

  const deleteBaby = (id) => {
    const remaining = deleteBabyFromStorage(id);
    setBabies(remaining);

    if (currentBabyId === id) {
      setCurrentBabyId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const switchBaby = (id) => {
    setCurrentBabyId(id);
  };

  const toggleVaccineStatus = (vaccineKey) => {
    if (!currentBabyId) return;

    const updated = toggleVaccine(currentBabyId, vaccineKey);
    if (updated) {
      setBabies(babies.map(baby => baby.id === currentBabyId ? updated : baby));
    }
  };

  const addMilestone = (milestone) => {
    if (!currentBabyId) return;

    const updated = addMilestoneToStorage(currentBabyId, milestone);
    if (updated) {
      setBabies(babies.map(baby => baby.id === currentBabyId ? updated : baby));
    }
  };

  const deleteMilestone = (milestoneId) => {
    if (!currentBabyId) return;

    const updated = deleteMilestoneFromStorage(currentBabyId, milestoneId);
    if (updated) {
      setBabies(babies.map(baby => baby.id === currentBabyId ? updated : baby));
    }
  };

  const addGrowthRecord = (record) => {
    if (!currentBabyId) return;

    const updated = addGrowthRecordToStorage(currentBabyId, record);
    if (updated) {
      setBabies(babies.map(baby => baby.id === currentBabyId ? updated : baby));
    }
  };

  const deleteGrowthRecord = (recordId) => {
    if (!currentBabyId) return;

    const updated = deleteGrowthRecordFromStorage(currentBabyId, recordId);
    if (updated) {
      setBabies(babies.map(baby => baby.id === currentBabyId ? updated : baby));
    }
  };

  const value = {
    babies,
    currentBaby,
    currentBabyId,
    loading,
    addBaby,
    updateBaby,
    deleteBaby,
    switchBaby,
    toggleVaccineStatus,
    addMilestone,
    deleteMilestone,
    addGrowthRecord,
    deleteGrowthRecord,
    refreshBabies: loadBabies
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};
