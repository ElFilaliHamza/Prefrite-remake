import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/loginAPI';
import '../assets/css/Styles/login.css';
import { useAppContext } from '../components/contexts/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const [, setState] = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      if (response.data.logged) {
        const { route } = response.data;
        setState((prevState) => ({
          ...prevState,
          session: response.data,
        }));
        navigate(`/${route}`);
      } else {
        setErrorMessage('Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="submit-btn" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
