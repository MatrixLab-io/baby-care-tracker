import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getErrorMessage } from '../utils/errorMessages';
import {
  getAllBabies,
  addBaby as addBabyToFirestore,
  updateBaby as updateBabyInFirestore,
  deleteBaby as deleteBabyFromFirestore,
  toggleVaccine,
  setVaccineState,
  addMilestone as addMilestoneToFirestore,
  deleteMilestone as deleteMilestoneFromFirestore,
  addGrowthRecord as addGrowthRecordToFirestore,
  deleteGrowthRecord as deleteGrowthRecordFromFirestore,
  addMedicalRecord as addMedicalRecordToFirestore,
  deleteMedicalRecord as deleteMedicalRecordFromFirestore
} from '../services/babyService';

const BabyContext = createContext();

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};

export const BabyProvider = ({ children }) => {
  const { user } = useAuth();
  const [babies, setBabies] = useState([]);
  const [currentBabyId, setCurrentBabyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBabies = useCallback(async () => {
    if (!user?.uid) {
      setBabies([]);
      setCurrentBabyId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const allBabies = await getAllBabies(user.uid);
      setBabies(allBabies);

      if (allBabies.length > 0 && !currentBabyId) {
        setCurrentBabyId(allBabies[0].id);
      } else if (allBabies.length === 0) {
        setCurrentBabyId(null);
      }
    } catch (err) {
      console.error('Error loading babies:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user?.uid, currentBabyId]);

  useEffect(() => {
    loadBabies();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentBaby = babies.find(baby => baby.id === currentBabyId);

  const addBaby = async (babyData) => {
    if (!user?.uid) throw new Error('User not authenticated');

    setError(null);
    try {
      const newBaby = await addBabyToFirestore(user.uid, babyData);
      setBabies(prev => [...prev, newBaby]);
      setCurrentBabyId(newBaby.id);
      return newBaby;
    } catch (err) {
      console.error('Error adding baby:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const updateBaby = async (id, updates) => {
    setError(null);
    try {
      const updated = await updateBabyInFirestore(id, updates);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === id ? updated : baby));
      }
      return updated;
    } catch (err) {
      console.error('Error updating baby:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteBaby = async (id) => {
    setError(null);
    try {
      await deleteBabyFromFirestore(id);
      const remaining = babies.filter(baby => baby.id !== id);
      setBabies(remaining);

      if (currentBabyId === id) {
        setCurrentBabyId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error('Error deleting baby:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const switchBaby = (id) => {
    setCurrentBabyId(id);
  };

  const toggleVaccineStatus = async (vaccineKey) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await toggleVaccine(currentBabyId, vaccineKey);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error toggling vaccine:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const setVaccineStateFor = async (vaccineKey, state) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await setVaccineState(currentBabyId, vaccineKey, state);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error updating vaccine:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const addMilestone = async (milestone) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await addMilestoneToFirestore(currentBabyId, milestone);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error adding milestone:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await deleteMilestoneFromFirestore(currentBabyId, milestoneId);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error deleting milestone:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const addGrowthRecord = async (record) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await addGrowthRecordToFirestore(currentBabyId, record);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error adding growth record:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteGrowthRecord = async (recordId) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await deleteGrowthRecordFromFirestore(currentBabyId, recordId);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error deleting growth record:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const addMedicalRecord = async (record) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await addMedicalRecordToFirestore(currentBabyId, record);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error adding medical record:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const deleteMedicalRecord = async (recordId) => {
    if (!currentBabyId) return;

    setError(null);
    try {
      const updated = await deleteMedicalRecordFromFirestore(currentBabyId, recordId);
      if (updated) {
        setBabies(prev => prev.map(baby => baby.id === currentBabyId ? updated : baby));
      }
    } catch (err) {
      console.error('Error deleting medical record:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const clearError = () => setError(null);

  const deleteAllUserData = async () => {
    if (!user?.uid) throw new Error('User not authenticated');

    setError(null);
    try {
      // Delete all babies (this also deletes their medical records subcollections)
      for (const baby of babies) {
        await deleteBabyFromFirestore(baby.id);
      }
      setBabies([]);
      setCurrentBabyId(null);
    } catch (err) {
      console.error('Error deleting all user data:', err);
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const value = {
    babies,
    currentBaby,
    currentBabyId,
    loading,
    error,
    addBaby,
    updateBaby,
    deleteBaby,
    switchBaby,
    toggleVaccineStatus,
    setVaccineState: setVaccineStateFor,
    addMilestone,
    deleteMilestone,
    addGrowthRecord,
    deleteGrowthRecord,
    addMedicalRecord,
    deleteMedicalRecord,
    deleteAllUserData,
    refreshBabies: loadBabies,
    clearError
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};
