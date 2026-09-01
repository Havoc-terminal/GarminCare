// Mock Data for GraminCare Maharashtra Ecosystem

export const INITIAL_FACILITIES = [
  { id: 'FAC-001', name: 'PHC Khed', type: 'Primary Health Centre', district: 'Pune', block: 'Khed', bedCount: 10 },
  { id: 'FAC-002', name: 'PHC Junnar', type: 'Primary Health Centre', district: 'Pune', block: 'Junnar', bedCount: 8 },
  { id: 'FAC-003', name: 'Rural Hospital Manchar', type: 'Rural Hospital', district: 'Pune', block: 'Ambegaon', bedCount: 30 },
  { id: 'FAC-004', name: 'District Hospital Pune (Aundh)', type: 'District Hospital', district: 'Pune', block: 'Haveli', bedCount: 250 },
  { id: 'FAC-005', name: 'Sub-Centre Bhamburda', type: 'Sub-Centre', district: 'Pune', block: 'Khed', bedCount: 2 }
];

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-2026-001',
    abhaId: '91-4829-1029-4821',
    name: 'Sunita Tukaram Shinde',
    age: 28,
    gender: 'Female',
    village: 'Bhamburda (Khed)',
    phone: '+91 98230 11204',
    preferredLanguage: 'mr', // Marathi
    registeredAt: '2026-08-25T09:30:00Z',
    highRisk: true,
    highRiskCategory: 'Maternal ANC (2nd Trimester)',
    syncStatus: 'synced',
    vitalsHistory: [
      {
        timestamp: '2026-08-26T08:15:00Z',
        bpSystolic: 155,
        bpDiastolic: 98,
        temperature: 99.1,
        pulse: 92,
        spo2: 96,
        weight: 54,
        symptoms: ['Severe Headache', 'Swelling in Feet', 'Dizziness'],
        voiceNote: 'Patient complains of persistent headache since yesterday morning and swelling in ankles.',
        triageResult: {
          level: 'RED',
          reason: 'High Blood Pressure in 2nd Trimester (Preeclampsia risk)',
          matchedRules: ['BP > 150/95 in Pregnant Patient', 'High-Risk Flag Active']
        }
      }
    ]
  },
  {
    id: 'PAT-2026-002',
    abhaId: '91-8841-3301-9920',
    name: 'Ramesh Balu Gaikwad',
    age: 52,
    gender: 'Male',
    village: 'Nimgaon (Junnar)',
    phone: '+91 94221 88392',
    preferredLanguage: 'mr',
    registeredAt: '2026-08-24T11:00:00Z',
    highRisk: true,
    highRiskCategory: 'Chronic Care (Hypertension/Diabetes)',
    syncStatus: 'synced',
    vitalsHistory: [
      {
        timestamp: '2026-08-26T09:00:00Z',
        bpSystolic: 172,
        bpDiastolic: 108,
        temperature: 98.4,
        pulse: 88,
        spo2: 95,
        weight: 68,
        symptoms: ['Chest Tightness on Exertion', 'Fatigue'],
        voiceNote: 'Patient states chest gets heavy while walking to the field.',
        triageResult: {
          level: 'RED',
          reason: 'Stage 2 Severe Hypertension with exertional chest symptoms',
          matchedRules: ['BP Systolic > 170', 'Chest Pain / Tightness']
        }
      }
    ]
  },
  {
    id: 'PAT-2026-003',
    abhaId: '91-1029-4482-7712',
    name: 'Aarav Sachin Jadhav',
    age: 4,
    gender: 'Male',
    village: 'Chakan',
    phone: '+91 97654 32109',
    preferredLanguage: 'hi',
    registeredAt: '2026-08-26T07:45:00Z',
    highRisk: false,
    syncStatus: 'synced',
    vitalsHistory: [
      {
        timestamp: '2026-08-26T07:45:00Z',
        bpSystolic: 100,
        bpDiastolic: 65,
        temperature: 102.3,
        pulse: 110,
        spo2: 97,
        weight: 14,
        symptoms: ['High Fever', 'Dry Cough', 'Loss of Appetite'],
        voiceNote: 'Child fever started last night, active but warm to touch.',
        triageResult: {
          level: 'YELLOW',
          reason: 'High Fever in pediatric patient without respiratory distress',
          matchedRules: ['Pediatric Temp > 101.5°F']
        }
      }
    ]
  },
  {
    id: 'PAT-2026-004',
    abhaId: '91-3049-5512-8833',
    name: 'Anandi Janardan Patil',
    age: 67,
    gender: 'Female',
    village: 'Rajgurunagar',
    phone: '+91 99210 44512',
    preferredLanguage: 'mr',
    registeredAt: '2026-08-23T14:20:00Z',
    highRisk: false,
    syncStatus: 'synced',
    vitalsHistory: [
      {
        timestamp: '2026-08-26T10:30:00Z',
        bpSystolic: 124,
        bpDiastolic: 80,
        temperature: 98.6,
        pulse: 72,
        spo2: 98,
        weight: 58,
        symptoms: ['Mild Joint Stiffness'],
        voiceNote: 'Routine checkup for knee osteoarthritis prescription refill.',
        triageResult: {
          level: 'GREEN',
          reason: 'Vitals within normal limits, routine symptom presentation',
          matchedRules: ['Normal Vitals']
        }
      }
    ]
  }
];

export const INITIAL_REFERRALS = [
  {
    id: 'REF-2026-08-01',
    patientId: 'PAT-2026-001',
    patientName: 'Sunita Tukaram Shinde',
    fromFacility: 'PHC Khed',
    toFacility: 'District Hospital Pune (Aundh)',
    urgency: 'HIGH',
    reason: 'Suspected severe preeclampsia with severe BP elevation, requires OBGYN specialist review',
    status: 'EN_ROUTE', // CREATED, EN_ROUTE, ARRIVED, CLOSED, AT_RISK
    createdAt: '2026-08-26T08:45:00Z',
    expectedArrival: '2026-08-26T12:00:00Z'
  },
  {
    id: 'REF-2026-08-02',
    patientId: 'PAT-2026-002',
    patientName: 'Ramesh Balu Gaikwad',
    fromFacility: 'PHC Junnar',
    toFacility: 'Rural Hospital Manchar',
    urgency: 'HIGH',
    reason: 'Hypertensive emergency + ECG evaluation needed',
    status: 'CREATED',
    createdAt: '2026-08-26T09:15:00Z',
    expectedArrival: '2026-08-26T14:00:00Z'
  }
];

export const INITIAL_INVENTORY = [
  { id: 'INV-101', facilityId: 'FAC-001', facilityName: 'PHC Khed', name: 'Paracetamol 500mg Tablets', category: 'Medicine', stockCount: 1450, unit: 'Tablets', status: 'AVAILABLE', lastUpdated: '2026-08-26T06:00:00Z' },
  { id: 'INV-102', facilityId: 'FAC-001', facilityName: 'PHC Khed', name: 'Amoxicillin 500mg Capsules', category: 'Medicine', stockCount: 80, unit: 'Capsules', status: 'LOW_STOCK', lastUpdated: '2026-08-26T06:00:00Z' },
  { id: 'INV-103', facilityId: 'FAC-001', facilityName: 'PHC Khed', name: 'Labetalol 100mg (Anti-hypertensive)', category: 'Medicine', stockCount: 0, unit: 'Tablets', status: 'OUT_OF_STOCK', nearestAlternative: 'PHC Junnar (12 km)', lastUpdated: '2026-08-25T18:00:00Z' },
  { id: 'INV-104', facilityId: 'FAC-001', facilityName: 'PHC Khed', name: 'Rapid Dengue NS1 Antigen Test Kit', category: 'Diagnostic', stockCount: 45, unit: 'Kits', status: 'AVAILABLE', lastUpdated: '2026-08-26T06:00:00Z' },
  { id: 'INV-105', facilityId: 'FAC-001', facilityName: 'PHC Khed', name: 'Hemoglobin Strips (Digital Meter)', category: 'Diagnostic', stockCount: 12, unit: 'Strips', status: 'LOW_STOCK', lastUpdated: '2026-08-26T06:00:00Z' },
  { id: 'INV-106', facilityId: 'FAC-002', facilityName: 'PHC Junnar', name: 'ORS Sachets', category: 'Medicine', stockCount: 800, unit: 'Sachets', status: 'AVAILABLE', lastUpdated: '2026-08-26T07:30:00Z' }
];

export const INITIAL_RECALL_TASKS = [
  {
    id: 'TSK-001',
    patientId: 'PAT-2026-001',
    patientName: 'Sunita Tukaram Shinde',
    village: 'Bhamburda',
    category: 'Maternal ANC',
    dueDate: '2026-08-26',
    taskDescription: 'ANC Checkup #2: Blood Pressure & Hemoglobin blood test',
    status: 'DUE_TODAY'
  },
  {
    id: 'TSK-002',
    patientId: 'PAT-2026-003',
    patientName: 'Aarav Sachin Jadhav',
    village: 'Chakan',
    category: 'Pediatric Immunization',
    dueDate: '2026-08-24',
    taskDescription: 'Measles-Rubella Booster 1st dose vaccination',
    status: 'OVERDUE'
  },
  {
    id: 'TSK-003',
    patientId: 'PAT-2026-002',
    patientName: 'Ramesh Balu Gaikwad',
    village: 'Nimgaon',
    category: 'Chronic Care',
    dueDate: '2026-08-27',
    taskDescription: 'Monthly Diabetes fasting blood glucose & BP log',
    status: 'UPCOMING'
  }
];

export const INITIAL_PHARMACIES = [
  { id: 'PHARM-01', name: 'Gramin Jan Aushadhi Kendra', village: 'Bhamburda (Khed)', distance: '0.8 km', phone: '+91 98221 00412', status: 'Open', lat: '18.8525', lng: '73.9110', timing: '8:00 AM - 9:00 PM' },
  { id: 'PHARM-02', name: 'Khed Community Medicos', village: 'Khed Town', distance: '2.5 km', phone: '+91 94230 55192', status: 'Open', lat: '18.8580', lng: '73.9180', timing: '24 Hours Open' },
  { id: 'PHARM-03', name: 'Shree Sai Pharma & Surgical', village: 'Chakan', distance: '5.1 km', phone: '+91 97641 22849', status: 'Open', lat: '18.7600', lng: '73.8600', timing: '9:00 AM - 10:00 PM' },
  { id: 'PHARM-04', name: 'Junnar Rural Medical Store', village: 'Junnar', distance: '11.4 km', phone: '+91 91580 33491', status: 'Closed', lat: '19.2000', lng: '73.8800', timing: '8:30 AM - 8:30 PM' }
];

export const INITIAL_DOCTORS = [
  { id: 'DOC-101', name: 'Dr. Aniket Deshmukh', spec: 'General Physician & MD', hospital: 'PHC Khed', distance: '1.2 km', phone: '+91 98220 11928', status: 'Available' },
  { id: 'DOC-102', name: 'Dr. Sunita Kulkarni', spec: 'Gynecologist & Obstetrician', hospital: 'District Hospital Pune (Aundh)', distance: '14.0 km', phone: '+91 94223 88102', status: 'On Duty' },
  { id: 'DOC-103', name: 'Dr. Rajesh Patil', spec: 'Pediatric Specialist', hospital: 'Rural Hospital Manchar', distance: '8.5 km', phone: '+91 97651 44029', status: 'Available' },
  { id: 'DOC-104', name: 'Dr. Priya Sharma', spec: 'Cardiologist & Emergency Care', hospital: 'Chakan Super Specialty', distance: '6.2 km', phone: '+91 99214 77301', status: 'On Call' }
];

export const INITIAL_SOS_REQUESTS = [
  { id: 'SOS-901', patientName: 'Sunita Tukaram Shinde', problem: 'Severe Preeclampsia BP spike (155/98)', location: 'Bhamburda, Khed', timestamp: '2026-08-26 21:45', status: '108 Ambulance En Route' },
  { id: 'SOS-902', patientName: 'Ramesh Balu Gaikwad', problem: 'Chest Tightness on Exertion (BP 172/108)', location: 'Nimgaon, Junnar', timestamp: '2026-08-26 20:30', status: 'PHC Doctor Notified' }
];

export const INITIAL_BIG_HOSPITALS = [
  {
    id: 'HOSP-01',
    name: 'District Hospital Pune (Aundh)',
    type: 'Government Super Specialty & Tertiary Care',
    distance: '14.0 km',
    city: 'Aundh, Pune',
    phone: '+91 20 2728 1080',
    emergencyHotline: '108 / +91 20 2728 9999',
    icuBedsTotal: 50,
    icuBedsAvailable: 12,
    specialties: ['Cardiology', 'Obstetrics & Gynecology (High Risk)', 'Trauma ICU', 'Pediatric Intensive Care'],
    description: 'Premier 250-bed apex government multi-specialty hospital equipped with 24x7 Neonatal ICU, Advanced Cath Lab, Trauma Emergency Ward, and high-risk pregnancy referral unit.'
  },
  {
    id: 'HOSP-02',
    name: 'Sub-District Hospital Manchar',
    type: 'Sub-District Hospital',
    distance: '8.5 km',
    city: 'Manchar, Ambegaon',
    phone: '+91 2135 223400',
    emergencyHotline: '+91 2135 223401',
    icuBedsTotal: 20,
    icuBedsAvailable: 6,
    specialties: ['General Surgery', 'Orthopedics', 'Pediatrics', 'Emergency Medicine'],
    description: '30-bed regional hospital serving Northern Pune blocks with 24x7 Emergency OT, Blood Storage Unit, and Maternal High-Risk Delivery Room.'
  },
  {
    id: 'HOSP-03',
    name: 'Chakan Multi-Specialty & Cardiac Care',
    type: 'Empaneled Tertiary Medical Center',
    distance: '6.2 km',
    city: 'Chakan, Pune',
    phone: '+91 2135 667800',
    emergencyHotline: '+91 2135 667899',
    icuBedsTotal: 30,
    icuBedsAvailable: 8,
    specialties: ['Interventional Cardiology', 'Neurology', 'Dialysis Center'],
    description: 'Modern tertiary center specializing in cardiac emergencies, stroke care, and automated dialysis.'
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 'RX-9001',
    patientName: 'Sunita Tukaram Shinde',
    phone: '+91 98230 11204',
    doctorName: 'Dr. Aniket Deshmukh (MD)',
    facility: 'PHC Khed',
    date: '2026-08-26',
    diagnosis: 'Preeclampsia risk evaluation, Stage 2 BP elevation (155/98 mmHg).',
    medicines: [
      { name: 'Labetalol 100mg', dosage: '1-0-1', duration: '5 days', instruction: 'After food' },
      { name: 'Calcium + Vitamin D3', dosage: '0-1-0', duration: '30 days', instruction: 'After lunch' },
      { name: 'Iron Folic Acid Tablet', dosage: '1-0-0', duration: '30 days', instruction: 'Morning empty stomach' }
    ],
    appointmentTime: 'Tomorrow at 10:30 AM',
    advice: 'Strict bed rest, low sodium diet, monitor BP twice daily.'
  },
  {
    id: 'RX-9002',
    patientName: 'Ramesh Balu Gaikwad',
    phone: '+91 94221 88392',
    doctorName: 'Dr. Aniket Deshmukh (MD)',
    facility: 'PHC Khed',
    date: '2026-08-26',
    diagnosis: 'Severe Stage 2 Hypertension with exertional discomfort.',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1-0-0', duration: '15 days', instruction: 'Morning after breakfast' },
      { name: 'Telmisartan 40mg', dosage: '0-0-1', duration: '15 days', instruction: 'Night before bed' }
    ],
    appointmentTime: 'Tomorrow at 11:15 AM',
    advice: 'Avoid strenuous physical labor, immediate ECG follow-up.'
  }
];

export const DICTIONARY = {
  en: {
    appTitle: 'GraminCare',
    tagline: 'Bridging Distance, Delivering Care',
    ashaApp: 'ASHA Field App',
    doctorConsole: 'Doctor Console',
    dashboard: 'District Analytics',
    pharmacy: 'Medicine & Stock',
    aiAssistant: 'AI Patient Assistant',
    syncArch: 'Sync & Architecture',
    patientRegistration: 'Patient Registration & Vitals',
    newPatient: 'New Patient',
    vitalsEntry: 'Record Vitals',
    triageBanner: 'Digital Triage Assessment',
    redUrgent: 'RED - URGENT CONSULTATION REQUIRED',
    yellowConsult: 'YELLOW - CONSULTATION NEEDED SOON',
    greenRoutine: 'GREEN - ROUTINE CARE / ADVICE',
    sosButton: 'TRIGGER EMERGENCY SOS',
    referralTracker: 'Referral Pipeline',
    stockStatus: 'Medicine Stock Visibility',
    onlineMode: 'Online Connected',
    offlineMode: 'Offline Mode (Local Storage)'
  },
  hi: {
    appTitle: 'ग्रामीणकेयर',
    tagline: 'दूरी घटाएं, स्वास्थ्य सेवाएं पहुंचाएं',
    ashaApp: 'आशा कार्यकर्ता ऐप',
    doctorConsole: 'डॉक्टर कंसोल',
    dashboard: 'जिला विश्लेषिकी',
    pharmacy: 'दवा एवं स्टॉक',
    aiAssistant: 'एआई स्वास्थ्य सहायक',
    syncArch: 'सिंक एवं आर्किटेक्चर',
    patientRegistration: 'मरीज पंजीकरण एवं वाइटल्स',
    newPatient: 'नया मरीज',
    vitalsEntry: 'वाइटल्स दर्ज करें',
    triageBanner: 'डिजिटल ट्राइएज आकलन',
    redUrgent: 'लाल - तत्काल आपातकालीन परामर्श',
    yellowConsult: 'पीला - शीघ्र परामर्श आवश्यक',
    greenRoutine: 'हरा - सामान्य देखभाल',
    sosButton: 'इमरजेंसी SOS अलर्ट भेजें',
    referralTracker: 'रेफरल ट्रैकिंग',
    stockStatus: 'दवा स्टॉक उपलब्धता',
    onlineMode: 'ऑनलाइन कनेक्टेड',
    offlineMode: 'ऑफलाइन मोड (लोकल स्टोरेज)'
  },
  mr: {
    appTitle: 'ग्रामीणकेअर',
    tagline: 'अंतर कमी करा, आरोग्य सेवा पुरवा',
    ashaApp: 'आशा सेविका अ‍ॅप',
    doctorConsole: 'डॉक्टर कॉन्सोल',
    dashboard: 'जिल्हा विश्लेषण',
    pharmacy: 'औषध व साठा',
    aiAssistant: 'एआय रुग्ण सहाय्यक',
    syncArch: 'सिंक व आर्किटेक्चर',
    patientRegistration: 'रुग्ण नोंदणी व व्हिटल्स',
    newPatient: 'नवीन रुग्ण',
    vitalsEntry: 'व्हिटल्स नोंदवा',
    triageBanner: 'डिजिटल ट्रायज मूल्यांकन',
    redUrgent: 'लाल - त्वरित आणीबाणीचा सल्ला आवश्यक',
    yellowConsult: 'पिवळा - लवकरच सल्ला आवश्यक',
    greenRoutine: 'हिरवा - नेहमीची काळजी',
    sosButton: 'इमर्जन्सी SOS अलर्ट पाठवा',
    referralTracker: 'रेफरल ट्रॅकिंग',
    stockStatus: 'औषध साठा उपलब्धता',
    onlineMode: 'ऑनलाइन कनेक्टेड',
    offlineMode: 'ऑफलाइन मोड (लोकल स्टोरेज)'
  }
};
