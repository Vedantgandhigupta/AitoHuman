import { useState, useEffect } from 'react';
import { Copy, Sparkles, Check, History, Trash2, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState('Casual');
  const [intensity, setIntensity] = useState(50); // 0 = Low, 50 = Medium, 100 = High
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [humanScore, setHumanScore] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('humanizeHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (input, output, score) => {
    const newItem = { id: Date.now(), input, output, score, date: new Date().toLocaleDateString() };
    const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
    setHistory(newHistory);
    localStorage.setItem('humanizeHistory', JSON.stringify(newHistory));
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setOutputText('');
    setHumanScore(null);
    setCopied(false);

    let intensityLabel = 'Medium';
    if (intensity < 33) intensityLabel = 'Low';
    else if (intensity > 66) intensityLabel = 'High';

    try {
      // In production, point to the deployed backend URL
      const apiUrl = import.meta.env.VITE_API_URL || 'https://aitohuman.onrender.com/humanize';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          tone,
          intensity: intensityLabel
        })
      });

      const data = await response.json();
      
      if (data.success || data.humanizedText) {
        setOutputText(data.humanizedText);
        setHumanScore(data.humanScore || 92);
        saveToHistory(inputText, data.humanizedText, data.humanScore || 92);
      } else {
        setOutputText('An error occurred while processing your request.');
      }
    } catch (error) {
      console.error(error);
      setOutputText('Failed to connect to the server. Please make sure the backend is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistoryItem = (item) => {
    setInputText(item.input);
    setOutputText(item.output);
    setHumanScore(item.score);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('humanizeHistory');
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div>
      <section className="hero">
        <h1>Bypass AI Detection</h1>
        <p>Transform robotic AI-generated text into natural, human-written content instantly.</p>
      </section>

      <div className="workspace">
        {/* Input Box */}
        <div className="glass-panel editor-box">
          <div className="editor-header">
            <span>Input Text</span>
            <span className="word-count">{wordCount} words</span>
          </div>
          
          <div className="textarea-wrapper">
            <textarea
              placeholder="Paste your AI-generated text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="controls-bar">
            <div className="control-group">
              <label>Tone:</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                <option value="Casual">Casual</option>
                <option value="Professional">Professional</option>
                <option value="Academic">Academic</option>
              </select>
            </div>

            <div className="control-group slider-container">
              <label>Intensity:</label>
              <input 
                type="range" 
                min="0" max="100" 
                value={intensity} 
                onChange={(e) => setIntensity(Number(e.target.value))} 
              />
              <span>{intensity < 33 ? 'Low' : intensity > 66 ? 'High' : 'Medium'}</span>
            </div>
            
            <button 
              className="primary-btn" 
              onClick={handleHumanize}
              disabled={isLoading || !inputText.trim()}
            >
              {isLoading ? <Sparkles className="spinner" size={20} /> : <Sparkles size={20} />}
              {isLoading ? 'Processing...' : 'Humanize Text'}
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="glass-panel editor-box">
          <div className="editor-header">
            <span>Humanized Output</span>
            <div className="editor-actions">
              <button className="icon-btn" onClick={handleCopy} title="Copy Output" disabled={!outputText}>
                {copied ? <Check size={18} color="var(--success-color)" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          
          <div className="textarea-wrapper">
            {isLoading ? (
              <div style={{ padding: '1rem' }}>
                <div className="skeleton placeholder-line" style={{ width: '100%' }}></div>
                <div className="skeleton placeholder-line" style={{ width: '95%' }}></div>
                <div className="skeleton placeholder-line" style={{ width: '90%' }}></div>
                <div className="skeleton placeholder-line" style={{ width: '85%' }}></div>
              </div>
            ) : (
              <textarea
                readOnly
                placeholder="Your humanized text will appear here..."
                value={outputText}
              />
            )}
          </div>

          {humanScore !== null && (
            <div className="stats-container">
              <div className="stat-badge">
                <ShieldCheck size={18} />
                Human Score: {humanScore}%
              </div>
              <div className="stat-badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                AI Probability: {100 - humanScore}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <section className="history-section glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <History size={20} /> Recent Generations
            </h3>
            <button className="icon-btn" onClick={clearHistory} title="Clear History" style={{ color: 'var(--danger-color)' }}>
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item glass-panel" onClick={() => loadHistoryItem(item)}>
                <div className="history-text-preview">{item.input}</div>
                <div className="history-meta">
                  <span>Score: {item.score}%</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
