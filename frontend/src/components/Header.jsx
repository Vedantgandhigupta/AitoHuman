import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Wand2 } from 'lucide-react';

export default function Header({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <header className="header">
      <Link to="/" className="logo">
        <Wand2 size={28} color="#818cf8" />
        HumanizeAI
      </Link>
      
      <nav className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </nav>
    </header>
  );
}
