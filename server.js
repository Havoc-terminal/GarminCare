// GraminCare Real-Time Multi-Device Sync & Live Video Relay Server
import http from 'http';
import { 
  INITIAL_PATIENTS, 
  INITIAL_REFERRALS, 
  INITIAL_INVENTORY, 
  INITIAL_RECALL_TASKS 
} from './src/data/mockData.js';

let state = {
  patients: INITIAL_PATIENTS,
  referrals: INITIAL_REFERRALS,
  inventory: INITIAL_INVENTORY,
  recalls: INITIAL_RECALL_TASKS
};

// Active SSE Connections
const clients = [];

function broadcastUpdate(type, payload) {
  const eventData = `data: ${JSON.stringify({ type, payload, timestamp: new Date().toISOString() })}\n\n`;
  clients.forEach(res => {
    try {
      res.write(eventData);
    } catch (e) {
      // client disconnected
    }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // SSE Real-Time Data & WebRTC Video Frame Channel
  if (req.url === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    
    clients.push(res);
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', payload: state })}\n\n`);

    req.on('close', () => {
      const idx = clients.indexOf(res);
      if (idx !== -1) clients.splice(idx, 1);
    });
    return;
  }

  // Camera Frame & Signaling Relay Endpoint
  if (req.method === 'POST' && req.url === '/api/signal') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const signalData = JSON.parse(body);
        broadcastUpdate(signalData.type || 'WEBRTC_SIGNAL', signalData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid Signal JSON' }));
      }
    });
    return;
  }

  // GET State
  if (req.method === 'GET' && req.url === '/api/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(state));
    return;
  }

  // POST Add Patient
  if (req.method === 'POST' && req.url === '/api/patients') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newPatient = JSON.parse(body);
        state.patients = [newPatient, ...state.patients];
        broadcastUpdate('PATIENT_ADDED', state);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, state }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // POST Add Referral
  if (req.method === 'POST' && req.url === '/api/referrals') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newReferral = JSON.parse(body);
        state.referrals = [newReferral, ...state.referrals];
        broadcastUpdate('REFERRAL_ADDED', state);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, state }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // POST Update Inventory
  if (req.method === 'POST' && req.url === '/api/inventory') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newInventory = JSON.parse(body);
        state.inventory = newInventory;
        broadcastUpdate('INVENTORY_UPDATED', state);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, state }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`GraminCare Real-Time & Live Video Relay Server running on http://0.0.0.0:${PORT}`);
});
