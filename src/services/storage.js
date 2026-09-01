// LocalStorage & Offline Sync Queue Manager for GraminCare
import { INITIAL_PATIENTS, INITIAL_REFERRALS, INITIAL_INVENTORY, INITIAL_RECALL_TASKS, INITIAL_PRESCRIPTIONS } from '../data/mockData';

const STORAGE_KEYS = {
  PATIENTS: 'gramincare_patients_v1',
  REFERRALS: 'gramincare_referrals_v1',
  INVENTORY: 'gramincare_inventory_v1',
  RECALLS: 'gramincare_recalls_v1',
  PRESCRIPTIONS: 'gramincare_prescriptions_v1',
  SYNC_QUEUE: 'gramincare_sync_queue_v1',
  IS_ONLINE: 'gramincare_is_online_v1'
};

export function getStoredPatients() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  }
}

export function savePatients(patients) {
  try {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (e) {}
}

export function getStoredReferrals() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(INITIAL_REFERRALS));
      return INITIAL_REFERRALS;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(INITIAL_REFERRALS));
    return INITIAL_REFERRALS;
  }
}

export function saveReferrals(referrals) {
  try {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  } catch (e) {}
}

export function getStoredInventory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  }
}

export function saveInventory(inventory) {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  } catch (e) {}
}

export function getStoredRecalls() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECALLS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.RECALLS, JSON.stringify(INITIAL_RECALL_TASKS));
      return INITIAL_RECALL_TASKS;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.RECALLS, JSON.stringify(INITIAL_RECALL_TASKS));
    return INITIAL_RECALL_TASKS;
  }
}

export function getSyncQueue() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function addToSyncQueue(item) {
  try {
    const queue = getSyncQueue();
    queue.push({
      id: `SYNC-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      ...item
    });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  } catch (e) {}
}

export function processSyncQueue() {
  try {
    const queue = getSyncQueue();
    const updatedQueue = queue.map(item => ({ ...item, status: 'SYNCED' }));
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updatedQueue));
    return updatedQueue;
  } catch (e) {
    return [];
  }
}

export function getOnlineStatus() {
  try {
    const status = localStorage.getItem(STORAGE_KEYS.IS_ONLINE);
    return status !== null ? JSON.parse(status) : true;
  } catch (e) {
    return true;
  }
}

export function setOnlineStatus(isOnline) {
  try {
    localStorage.setItem(STORAGE_KEYS.IS_ONLINE, JSON.stringify(isOnline));
  } catch (e) {}
}

export function getStoredPrescriptions() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
      return INITIAL_PRESCRIPTIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    return INITIAL_PRESCRIPTIONS;
  }
}

export function savePrescriptions(prescriptions) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  } catch (e) {}
}
