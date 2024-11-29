import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [utorid, setUtorid] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (utorid === 'xietao2' && password === '1234') {
      setIsLoggedIn(true);
      setError('');
      navigate('/form');
    } else {
      setError('Invalid UTORid or Password');
    }

    // Optionally reset the form fields
    setPassword('');
  };

  if (isLoggedIn) {
    return (
      <div className="login-container">
        <h1 className="title">Welcome, {utorid}!</h1>
        <p>You have successfully logged in.</p>
        {/* You can replace this with a redirect to another component or page */}
      </div>
    );
  }

  return (
    <div className="login-container">
      <h1 className="title">MapMatch</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <label htmlFor="utorid">UTORid</label>
        <input
          type="text"
          id="utorid"
          name="utorid"
          value={utorid}
          onChange={(e) => setUtorid(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default LoginPage;
