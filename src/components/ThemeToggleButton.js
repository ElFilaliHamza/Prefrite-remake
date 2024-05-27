import React, { useState, useEffect } from 'react';
import '../assets/css/main.css';

const ThemeToggleButton = () => {
  const initialTheme = (localStorage && localStorage.getItem('theme')) || 'light';
  const [theme, setTheme] = useState({ theme: initialTheme });

  useEffect(() => {
    document.body.className = theme.theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme.theme === 'dark' ? 'light' : 'dark';
      if (localStorage) {
        localStorage.setItem('theme', newTheme);
      }
      return { theme: newTheme };
    });
  };

  return (
    <div
      className="refresh-btn"
      tabIndex={0}
      onClick={toggleTheme}
      style={{ margin: '5px 10px' }}
    >
      <i className="fas fa-adjust" />
    </div>
  );
};

export default ThemeToggleButton;
