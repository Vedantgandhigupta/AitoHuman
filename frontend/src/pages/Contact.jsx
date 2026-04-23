import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/contact';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message. Please check the backend configuration.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content glass-panel" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Contact Us</h1>
      <p>We'd love to hear from you! Send us a message and we'll get back to you.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
        />
        <input 
          type="email" 
          placeholder="Your Email" 
          required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
        />
        <textarea 
          placeholder="Your Message" 
          required 
          rows="5"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          style={{ padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text-primary)', resize: 'vertical' }}
        />
        <button type="submit" className="primary-btn" disabled={isLoading} style={{ justifyContent: 'center' }}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        {status && <p style={{ textAlign: 'center', marginTop: '0.5rem', color: status.includes('success') ? 'var(--success-color)' : 'var(--danger-color)' }}>{status}</p>}
      </form>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
        <p><strong>Email:</strong> vedantg546@gmail.com</p>
        <p><strong>Linkedin:</strong> <a href="https://www.linkedin.com/in/vedant-gupta-764178366" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)' }}>linkedin.com/in/vedant-gupta-764178366</a></p>
        <p><strong>Location:</strong> Maharashtra, India</p>
      </div>
    </div>
  );
}
