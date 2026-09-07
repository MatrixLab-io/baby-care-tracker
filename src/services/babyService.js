import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

const BABIES_COLLECTION = 'babies';
const MEDICAL_RECORDS_SUBCOLLECTION = 'medicalRecords';

/**
 * Get medical records for a baby (from subcollection)
 */
const getMedicalRecords = async (babyId) => {
  const recordsRef = collection(db, BABIES_COLLECTION, babyId, MEDICAL_RECORDS_SUBCOLLECTION);
  const q = query(recordsRef, orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

/**
 * Get all babies for a user
 */
export const getAllBabies = async (userId) => {
  const q = query(
    collection(db, BABIES_COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);

  // Fetch babies with their medical records
  const babies = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const babyData = { id: docSnap.id, ...docSnap.data() };
      // Fetch medical records from subcollection
      babyData.medicalRecords = await getMedicalRecords(docSnap.id);
      return babyData;
    })
  );

  return babies;
};

/**
 * Get a single baby by ID
 */
export const getBabyById = async (babyId) => {
  const docRef = doc(db, BABIES_COLLECTION, babyId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;

  const babyData = { id: snapshot.id, ...snapshot.data() };
  // Fetch medical records from subcollection
  babyData.medicalRecords = await getMedicalRecords(babyId);
  return babyData;
};

/**
 * Add a new baby
 */
export const addBaby = async (userId, babyData) => {
  // Extract medical records to add separately
  const { medicalRecords, ...babyInfo } = babyData;

  const newBaby = {
    userId,
    name: babyInfo.name,
    dob: babyInfo.dob,
    gender: babyInfo.gender || '',
    bloodGroup: babyInfo.bloodGroup || '',
    photo: babyInfo.photo || '',
    vaccines: {},
    milestones: [],
    growthRecords: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, BABIES_COLLECTION), newBaby);

  // Add medical records to subcollection
  const addedRecords = [];
  if (medicalRecords && medicalRecords.length > 0) {
    for (const record of medicalRecords) {
      const recordRef = await addDoc(
        collection(db, BABIES_COLLECTION, docRef.id, MEDICAL_RECORDS_SUBCOLLECTION),
        {
          name: record.name,
          type: record.type,
          size: record.size,
          data: record.data,
          uploadedAt: record.uploadedAt || new Date().toISOString()
        }
      );
      addedRecords.push({ id: recordRef.id, ...record });
    }
  }

  return { id: docRef.id, ...newBaby, medicalRecords: addedRecords };
};

/**
 * Update a baby
 */
export const updateBaby = async (babyId, updates) => {
  // Don't allow updating medicalRecords through this function
  const { medicalRecords, ...safeUpdates } = updates;

  const docRef = doc(db, BABIES_COLLECTION, babyId);
  await updateDoc(docRef, {
    ...safeUpdates,
    updatedAt: serverTimestamp()
  });
  return getBabyById(babyId);
};

/**
 * Delete a baby (including all medical records)
 */
export const deleteBaby = async (babyId) => {
  // First delete all medical records in subcollection
  const recordsRef = collection(db, BABIES_COLLECTION, babyId, MEDICAL_RECORDS_SUBCOLLECTION);
  const recordsSnapshot = await getDocs(recordsRef);

  for (const recordDoc of recordsSnapshot.docs) {
    await deleteDoc(recordDoc.ref);
  }

  // Then delete the baby document
  const docRef = doc(db, BABIES_COLLECTION, babyId);
  await deleteDoc(docRef);
};

/**
 * Set a vaccine to 'given', 'skipped' or 'pending'.
 * Stored as `true` / `'skipped'` / removed, so documents written before
 * skipping existed keep working with no migration.
 */
export const setVaccineState = async (babyId, vaccineKey, state) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const vaccines = { ...baby.vaccines };
  if (state === 'given') {
    vaccines[vaccineKey] = true;
  } else if (state === 'skipped') {
    vaccines[vaccineKey] = 'skipped';
  } else {
    delete vaccines[vaccineKey];
  }

  return updateBaby(babyId, { vaccines });
};

/**
 * Toggle a vaccine between given and pending.
 */
export const toggleVaccine = async (babyId, vaccineKey) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const isGiven = baby.vaccines?.[vaccineKey] === true;
  return setVaccineState(babyId, vaccineKey, isGiven ? 'pending' : 'given');
};

/**
 * Add milestone
 */
export const addMilestone = async (babyId, milestone) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const milestones = [...(baby.milestones || [])];
  milestones.push({
    id: Date.now().toString(),
    ...milestone,
    createdAt: new Date().toISOString()
  });

  return updateBaby(babyId, { milestones });
};

/**
 * Delete milestone
 */
export const deleteMilestone = async (babyId, milestoneId) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const milestones = (baby.milestones || []).filter(m => m.id !== milestoneId);
  return updateBaby(babyId, { milestones });
};

/**
 * Add growth record
 */
export const addGrowthRecord = async (babyId, record) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const growthRecords = [...(baby.growthRecords || [])];
  growthRecords.push({
    id: Date.now().toString(),
    ...record,
    createdAt: new Date().toISOString()
  });

  // Sort by date
  growthRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

  return updateBaby(babyId, { growthRecords });
};

/**
 * Delete growth record
 */
export const deleteGrowthRecord = async (babyId, recordId) => {
  const baby = await getBabyById(babyId);
  if (!baby) return null;

  const growthRecords = (baby.growthRecords || []).filter(r => r.id !== recordId);
  return updateBaby(babyId, { growthRecords });
};

/**
 * Add medical record (to subcollection)
 */
export const addMedicalRecord = async (babyId, record) => {
  const recordData = {
    name: record.name,
    type: record.type,
    size: record.size,
    data: record.data,
    uploadedAt: new Date().toISOString()
  };

  const recordRef = await addDoc(
    collection(db, BABIES_COLLECTION, babyId, MEDICAL_RECORDS_SUBCOLLECTION),
    recordData
  );

  // Return updated baby with all medical records
  return getBabyById(babyId);
};

/**
 * Delete medical record (from subcollection)
 */
export const deleteMedicalRecord = async (babyId, recordId) => {
  const recordRef = doc(db, BABIES_COLLECTION, babyId, MEDICAL_RECORDS_SUBCOLLECTION, recordId);
  await deleteDoc(recordRef);

  // Return updated baby with remaining medical records
  return getBabyById(babyId);
};
