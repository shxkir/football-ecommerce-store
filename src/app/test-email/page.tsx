'use client';

import React, { useState, useEffect } from 'react';

export default function TestEmailPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      VERIFICATION_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_VERIFICATION_TEMPLATE_ID,
      RESET_PASSWORD_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_RESET_PASSWORD_TEMPLATE_ID,
    });
  }, []);

  const testEmailJS = async () => {
    setLoading(true);
    setTestResult('Testing EmailJS...');

    try {
      const emailjs = await import('@emailjs/browser');

      // Initialize EmailJS
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (publicKey) {
        emailjs.default.init(publicKey);
        setTestResult(prev => prev + '\n✓ EmailJS initialized');
      } else {
        setTestResult(prev => prev + '\n✗ Public key missing');
        return;
      }

      // Test sending email
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_VERIFICATION_TEMPLATE_ID;

      if (!serviceId || !templateId) {
        setTestResult(prev => prev + '\n✗ Service ID or Template ID missing');
        return;
      }

      setTestResult(prev => prev + '\n→ Sending test email...');

      const result = await emailjs.default.send(
        serviceId,
        templateId,
        {
          to_email: 'test@example.com',
          to_name: 'Test User',
          verification_code: '123456',
        }
      );

      setTestResult(prev => prev + '\n✓ Email sent successfully!');
      setTestResult(prev => prev + '\nResult: ' + JSON.stringify(result, null, 2));
    } catch (error: any) {
      setTestResult(prev => prev + '\n✗ Error: ' + error.message);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#000', fontWeight: 'bold' }}>EmailJS Configuration Test</h1>

      <h2 style={{ color: '#000', fontWeight: 'bold' }}>Environment Variables:</h2>
      <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', color: '#000', fontWeight: 600 }}>
        {JSON.stringify(envVars, null, 2)}
      </pre>

      <button
        onClick={testEmailJS}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '20px',
        }}
      >
        {loading ? 'Testing...' : 'Test EmailJS'}
      </button>

      {testResult && (
        <>
          <h2 style={{ color: '#000', fontWeight: 'bold' }}>Test Result:</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', color: '#000', fontWeight: 600 }}>
            {testResult}
          </pre>
        </>
      )}

      <div style={{ marginTop: '20px', padding: '10px', background: '#fff3cd', borderRadius: '5px', color: '#000' }}>
        <strong style={{ fontSize: '16px' }}>Instructions:</strong>
        <ol style={{ fontWeight: 600 }}>
          <li>Check if all environment variables are loaded (not undefined)</li>
          <li>Click "Test EmailJS" button</li>
          <li>Check the console (F12) for any errors</li>
          <li>If successful, you should see "Email sent successfully!"</li>
        </ol>
      </div>
    </div>
  );
}
