import { useState, useEffect } from 'react';

function Header({ theme, onToggleTheme }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  /* Live ticking clock — updates every second */
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    /* Cleanup: clear interval on unmount (demonstrates React lifecycle) */
    return () => clearInterval(timerId);
  }, []);

  /* Dynamic greeting based on hour */
  const hour = currentTime.getHours();
  let greeting;
  if (hour < 12) {
    greeting = 'Good Morning';
  } else if (hour < 17) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-brand">
            <span className="header-logo" role="img" aria-label="lightning bolt">⚡</span>
            <h1 className="header-title">TaskFlow</h1>
          </div>
          <p className="header-tagline">Stay organised, stay ahead.</p>
        </div>

        <div className="header-right">
          <span className="header-greeting">{greeting} 👋</span>
          <time className="header-clock" dateTime={currentTime.toISOString()}>
            {formattedTime}
          </time>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="theme-toggle-icon">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
