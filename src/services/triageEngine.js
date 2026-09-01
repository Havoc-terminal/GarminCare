// GraminCare Digital Triage Engine (Rule-based clinical decision support)

export function evaluateTriage(vitals, symptoms = [], patientMeta = {}) {
  const matchedRules = [];
  let level = 'GREEN';
  let reason = 'Vitals and symptoms are within normal parameters.';

  let bpSys = 120, bpDia = 80, temp = 98.6, pulse = 75, spo2 = 98;
  let symptomsList = [];

  if (typeof vitals === 'object' && vitals !== null) {
    bpSys = parseFloat(vitals.bpSystolic) || parseFloat(vitals.systolic) || 120;
    bpDia = parseFloat(vitals.bpDiastolic) || parseFloat(vitals.diastolic) || 80;
    temp = parseFloat(vitals.temperature) || parseFloat(vitals.temp) || 98.6;
    pulse = parseFloat(vitals.pulse) || 75;
    spo2 = parseFloat(vitals.spo2) || 98;
    symptomsList = Array.isArray(symptoms) ? symptoms : typeof symptoms === 'string' ? [symptoms] : [];
  } else {
    // Legacy positional arguments: evaluateTriage(bpSys, bpDia, spo2, pulse, complaint)
    bpSys = parseFloat(vitals) || 120;
    bpDia = parseFloat(arguments[1]) || 80;
    spo2 = parseFloat(arguments[2]) || 98;
    pulse = parseFloat(arguments[3]) || 75;
    const complaint = arguments[4];
    symptomsList = typeof complaint === 'string' ? [complaint] : Array.isArray(complaint) ? complaint : [];
  }

  const age = parseFloat(patientMeta.age) || 30;
  const isPregnant = patientMeta.highRiskCategory?.includes('Maternal') || false;

  // 1. URGENT / RED RULES
  if (bpSys >= 170 || bpDia >= 105) {
    level = 'RED';
    matchedRules.push(`Severe Hypertensive Crisis (BP ${bpSys}/${bpDia} mmHg)`);
  } else if (isPregnant && (bpSys >= 150 || bpDia >= 95)) {
    level = 'RED';
    matchedRules.push(`High BP in Pregnancy - Preeclampsia Risk (BP ${bpSys}/${bpDia} mmHg)`);
  }

  if (spo2 < 90) {
    level = 'RED';
    matchedRules.push(`Severe Hypoxia (SpO2 ${spo2}%)`);
  }

  if (temp >= 103.5) {
    level = 'RED';
    matchedRules.push(`Hyperpyrexia Fever (${temp}°F)`);
  } else if (age < 5 && temp >= 102) {
    level = 'RED';
    matchedRules.push(`Pediatric High Fever Risk (${temp}°F in child aged ${age})`);
  }

  if (pulse > 130 || pulse < 45) {
    level = 'RED';
    matchedRules.push(`Critical Heart Rate anomaly (${pulse} bpm)`);
  }

  const redSymptoms = [
    'Chest Tightness on Exertion', 'Chest Pain', 'Convulsions / Fits', 
    'Severe Breathlessness', 'Unconsciousness', 'Snake / Animal Bite', 
    'Heavy Bleeding', 'छातीत दुखणे', 'छातीत दुखत', 'stroke', 'paralysis'
  ];

  symptomsList.forEach(sym => {
    if (redSymptoms.some(r => sym.toLowerCase().includes(r.toLowerCase()))) {
      level = 'RED';
      matchedRules.push(`Emergency Symptom Flag: ${sym}`);
    }
  });

  // 2. CONSULT SOON / YELLOW RULES (if not already RED)
  if (level !== 'RED') {
    if (bpSys >= 140 || bpDia >= 90) {
      level = 'YELLOW';
      matchedRules.push(`Stage 1 Hypertension (BP ${bpSys}/${bpDia} mmHg)`);
    }

    if (spo2 >= 90 && spo2 <= 94) {
      level = 'YELLOW';
      matchedRules.push(`Moderate Low Oxygen (SpO2 ${spo2}%)`);
    }

    if (temp >= 101 && temp < 103.5) {
      level = 'YELLOW';
      matchedRules.push(`Moderate High Fever (${temp}°F)`);
    }

    if (pulse >= 110 && pulse <= 130) {
      level = 'YELLOW';
      matchedRules.push(`Tachycardia (${pulse} bpm)`);
    }

    const yellowSymptoms = [
      'Severe Headache', 'Swelling in Feet', 'Loss of Appetite', 
      'Persistent Vomiting', 'Dizziness', 'Abdominal Pain', 'High Fever',
      'fever', 'cough', 'weakness', 'ताप', 'खोकला', 'chills', 'vomiting'
    ];

    symptomsList.forEach(sym => {
      if (yellowSymptoms.some(y => sym.toLowerCase().includes(y.toLowerCase()))) {
        if (level !== 'RED') level = 'YELLOW';
        matchedRules.push(`Clinical Symptom Flag: ${sym}`);
      }
      
      // Predictive AI flags for Outbreak Radar
      const dengueKeywords = ['high fever', 'joint pain', 'rash', 'dengue', 'ताप', 'डेंग्यू'];
      const malariaKeywords = ['chills', 'shivering', 'malaria', 'मलेरिया', 'थंडी'];
      
      if (dengueKeywords.some(d => sym.toLowerCase().includes(d.toLowerCase()))) {
        matchedRules.push(`AI Alert: Potential Dengue Signature`);
        if (level !== 'RED') level = 'YELLOW';
      }
      if (malariaKeywords.some(m => sym.toLowerCase().includes(m.toLowerCase()))) {
        matchedRules.push(`AI Alert: Potential Malaria Signature`);
        if (level !== 'RED') level = 'YELLOW';
      }
    });
  }

  // Summary Reason Generation
  if (level === 'RED') {
    reason = `FLAGGED RED (URGENT): ${matchedRules.join('; ')}`;
  } else if (level === 'YELLOW') {
    reason = `FLAGGED YELLOW (CONSULT SOON): ${matchedRules.join('; ')}`;
  } else {
    reason = `FLAGGED GREEN (ROUTINE): Patient stable. ${matchedRules.length ? matchedRules.join('; ') : 'All vitals within standard thresholds.'}`;
  }

  return {
    level,
    reason,
    matchedRules: matchedRules.length > 0 ? matchedRules : ['Normal clinical baseline']
  };
}
