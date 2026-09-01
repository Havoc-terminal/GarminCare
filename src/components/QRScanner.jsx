import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, XCircle } from 'lucide-react';

export function QRScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      false
    );

    const handleScanSuccess = (decodedText, decodedResult) => {
      try {
        const data = JSON.parse(decodedText);
        scanner.clear();
        onScanSuccess(data);
      } catch (e) {
        // Not a valid GraminCare JSON QR, but maybe we can still return the raw text
        scanner.clear();
        onScanSuccess({ raw: decodedText });
      }
    };

    const handleScanFailure = (error) => {
      // Ignore scan failures (usually just means no QR code found yet)
    };

    scanner.render(handleScanSuccess, handleScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="modal-overlay-dark" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content-dark" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '1rem', background: 'var(--bg-main)', border: '1px solid var(--green-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--green-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Camera size={18} /> Scan Patient Health Card
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-danger)', cursor: 'pointer', display: 'flex' }}>
            <XCircle size={20} />
          </button>
        </div>
        
        <div style={{ background: 'var(--bg-black)', borderRadius: '12px', overflow: 'hidden' }}>
          <div id="qr-reader" style={{ width: '100%', border: 'none' }}></div>
        </div>
        
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
          Align the QR code within the frame to automatically scan.
        </p>
      </div>
      <style>{`
        #qr-reader { border: none !important; }
        #qr-reader__scan_region { background: #000; }
        #qr-reader__dashboard_section_csr button {
          background: var(--green-primary);
          color: #000;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        #qr-reader__dashboard_section_csr span { color: #fff !important; }
        #qr-reader__status_span { background: transparent !important; color: #fff !important; }
      `}</style>
    </div>
  );
}
