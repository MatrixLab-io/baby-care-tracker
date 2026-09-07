// Maps disease keywords to relevant vaccine keys in the system
// Used to recommend vaccines when outbreaks are detected
export const DISEASE_VACCINE_MAP = {
  measles: {
    disease: 'Measles',
    vaccines: ['mr1', 'mr2', 'pvt_mmr1', 'pvt_mmr2'],
    description: 'Measles is preventable with MR/MMR vaccines.'
  },
  rubella: {
    disease: 'Rubella',
    vaccines: ['mr1', 'mr2', 'pvt_mmr1', 'pvt_mmr2'],
    description: 'Rubella is preventable with MR/MMR vaccines.'
  },
  mumps: {
    disease: 'Mumps',
    vaccines: ['pvt_mmr1', 'pvt_mmr2'],
    description: 'Mumps is preventable with MMR vaccine.'
  },
  polio: {
    disease: 'Polio',
    vaccines: ['bcg', 'penta1', 'penta2', 'penta3', 'pvt_ipv', 'pvt_ipv_booster'],
    description: 'Polio is preventable with OPV/IPV vaccines.'
  },
  diphtheria: {
    disease: 'Diphtheria',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_dpt_booster', 'pvt_tdap'],
    description: 'Diphtheria is preventable with DPT/Pentavalent vaccines.'
  },
  pertussis: {
    disease: 'Pertussis (Whooping Cough)',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_dpt_booster', 'pvt_tdap'],
    description: 'Pertussis is preventable with DPT/Pentavalent vaccines.'
  },
  'whooping cough': {
    disease: 'Pertussis (Whooping Cough)',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_dpt_booster', 'pvt_tdap'],
    description: 'Pertussis is preventable with DPT/Pentavalent vaccines.'
  },
  tetanus: {
    disease: 'Tetanus',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_dpt_booster', 'pvt_tdap'],
    description: 'Tetanus is preventable with DPT/Pentavalent/Tdap vaccines.'
  },
  typhoid: {
    disease: 'Typhoid',
    vaccines: ['pvt_typhoid1', 'pvt_typhoid2', 'pvt_typhoid3'],
    description: 'Typhoid is preventable with Typhoid vaccine.'
  },
  'hepatitis a': {
    disease: 'Hepatitis A',
    vaccines: ['pvt_hepa1', 'pvt_hepa2'],
    description: 'Hepatitis A is preventable with Hepatitis A vaccine.'
  },
  'hepatitis b': {
    disease: 'Hepatitis B',
    vaccines: ['penta1', 'penta2', 'penta3'],
    description: 'Hepatitis B is covered by the Pentavalent vaccine.'
  },
  chickenpox: {
    disease: 'Chickenpox (Varicella)',
    vaccines: ['pvt_varicella1', 'pvt_varicella2'],
    description: 'Chickenpox is preventable with Varicella vaccine.'
  },
  varicella: {
    disease: 'Chickenpox (Varicella)',
    vaccines: ['pvt_varicella1', 'pvt_varicella2'],
    description: 'Chickenpox is preventable with Varicella vaccine.'
  },
  rotavirus: {
    disease: 'Rotavirus',
    vaccines: ['pvt_rotavirus1', 'pvt_rotavirus2', 'pvt_rotavirus3'],
    description: 'Rotavirus diarrhea is preventable with Rotavirus vaccine.'
  },
  pneumonia: {
    disease: 'Pneumonia (Pneumococcal)',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_pcv_booster', 'pvt_pneumovax'],
    description: 'Pneumococcal pneumonia is preventable with PCV/Pneumovax vaccines.'
  },
  pneumococcal: {
    disease: 'Pneumococcal Disease',
    vaccines: ['penta1', 'penta2', 'penta3', 'pvt_pcv_booster', 'pvt_pneumovax'],
    description: 'Pneumococcal disease is preventable with PCV/Pneumovax vaccines.'
  },
  hpv: {
    disease: 'HPV',
    vaccines: ['pvt_hpv1', 'pvt_hpv2'],
    description: 'HPV is preventable with the Gardasil vaccine.'
  }
};

// Match outbreak text against known diseases
export const matchOutbreakToDiseases = (text) => {
  const lowerText = text.toLowerCase();
  const matches = [];

  for (const [keyword, mapping] of Object.entries(DISEASE_VACCINE_MAP)) {
    if (lowerText.includes(keyword)) {
      // Avoid duplicate disease entries (e.g., "chickenpox" and "varicella" are the same)
      if (!matches.some(m => m.disease === mapping.disease)) {
        matches.push(mapping);
      }
    }
  }

  return matches;
};

// Get vaccine recommendations for a baby based on outbreak matches
export const getOutbreakVaccineRecommendations = (diseaseMatches, completedVaccines = {}) => {
  const recommendations = [];

  for (const match of diseaseMatches) {
    const pendingVaccines = match.vaccines.filter(key => !completedVaccines[key]);

    if (pendingVaccines.length > 0) {
      recommendations.push({
        disease: match.disease,
        description: match.description,
        pendingVaccineKeys: pendingVaccines,
        allVaccineKeys: match.vaccines,
        isFullyVaccinated: false
      });
    } else {
      recommendations.push({
        disease: match.disease,
        description: match.description,
        pendingVaccineKeys: [],
        allVaccineKeys: match.vaccines,
        isFullyVaccinated: true
      });
    }
  }

  return recommendations;
};
