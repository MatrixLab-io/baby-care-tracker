const STORAGE_KEY = 'babycare_data';

/**
 * Get all babies from localStorage
 */
export const getAllBabies = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save all babies to localStorage
 */
export const saveAllBabies = (babies) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(babies));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get a single baby by ID
 */
export const getBabyById = (id) => {
  const babies = getAllBabies();
  return babies.find(baby => baby.id === id);
};

/**
 * Add a new baby
 */
export const addBaby = (babyData) => {
  const babies = getAllBabies();
  const newBaby = {
    id: Date.now().toString(),
    name: babyData.name,
    dob: babyData.dob,
    gender: babyData.gender || '',
    bloodGroup: babyData.bloodGroup || '',
    photo: babyData.photo || '',
    vaccines: {},
    milestones: [],
    growthRecords: [],
    medicalRecords: babyData.medicalRecords || [],
    createdAt: new Date().toISOString()
  };

  babies.push(newBaby);
  saveAllBabies(babies);
  return newBaby;
};

/**
 * Update a baby
 */
export const updateBaby = (id, updates) => {
  const babies = getAllBabies();
  const index = babies.findIndex(baby => baby.id === id);

  if (index === -1) return null;

  babies[index] = {
    ...babies[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };

  saveAllBabies(babies);
  return babies[index];
};

/**
 * Delete a baby
 */
export const deleteBaby = (id) => {
  const babies = getAllBabies();
  const filtered = babies.filter(baby => baby.id !== id);
  saveAllBabies(filtered);
  return filtered;
};

/**
 * Toggle vaccine status
 */
export const toggleVaccine = (babyId, vaccineKey) => {
  const baby = getBabyById(babyId);
  if (!baby) return null;

  const vaccines = { ...baby.vaccines };
  vaccines[vaccineKey] = !vaccines[vaccineKey];

  return updateBaby(babyId, { vaccines });
};

/**
 * Add milestone
 */
export const addMilestone = (babyId, milestone) => {
  const baby = getBabyById(babyId);
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
export const deleteMilestone = (babyId, milestoneId) => {
  const baby = getBabyById(babyId);
  if (!baby) return null;

  const milestones = (baby.milestones || []).filter(m => m.id !== milestoneId);
  return updateBaby(babyId, { milestones });
};

/**
 * Add growth record
 */
export const addGrowthRecord = (babyId, record) => {
  const baby = getBabyById(babyId);
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
export const deleteGrowthRecord = (babyId, recordId) => {
  const baby = getBabyById(babyId);
  if (!baby) return null;

  const growthRecords = (baby.growthRecords || []).filter(r => r.id !== recordId);
  return updateBaby(babyId, { growthRecords });
};

/**
 * Add medical record
 */
export const addMedicalRecord = (babyId, record) => {
  const baby = getBabyById(babyId);
  if (!baby) return null;

  const medicalRecords = [...(baby.medicalRecords || [])];
  medicalRecords.push({
    id: Date.now().toString(),
    ...record,
    uploadedAt: new Date().toISOString()
  });

  return updateBaby(babyId, { medicalRecords });
};

/**
 * Delete medical record
 */
export const deleteMedicalRecord = (babyId, recordId) => {
  const baby = getBabyById(babyId);
  if (!baby) return null;

  const medicalRecords = (baby.medicalRecords || []).filter(r => r.id !== recordId);
  return updateBaby(babyId, { medicalRecords });
};
