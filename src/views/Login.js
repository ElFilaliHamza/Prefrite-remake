import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/loginAPI';
import '../assets/css/Styles/login.css';
import { useAppContext } from '../components/contexts/AppContext';
import CustomParticales from '../components/CustomParticales';

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission
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
      setErrorMessage('An error occurred. Please try again.' + error.message);
    }
  };


  return (
    <div className="app-container">
      <div className="body">
        {/* <CustomParticales /> */}
        <div className="simple-container">
          <div className="global-login">
            <div className="title">Se Connecter</div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleLogin}>
              <div className="box">
                <div className="inputContainer">
                  <div className="icon"><i className="far fa-envelope"></i></div>
                  <input
                    className="input"
                    type="text"
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="inputContainer">
                  <div className="icon"><i className="far fa-lock"></i></div>
                  <input
                    name="password"
                    className="input"
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div tabIndex="1" className="eye-password"><i className="far fa-eye"></i></div>
                </div>
                <label tabIndex="0">
                  <input type="submit" hidden />
                  <div className="submit-btn">Se Connecter</div>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
