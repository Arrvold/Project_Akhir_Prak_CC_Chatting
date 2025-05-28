// src/auth/AuthProvider.jsx
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/axiosinstance.js";
import PropTypes from 'prop-types';
import { BASE_URL } from "../utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
      const userData = sessionStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
  });

  const setAuthState = (newAccessToken, newUser, newRefreshToken) => {
      setAccessToken(newAccessToken); 
      setUser(newUser);             
      localStorage.setItem("token", newAccessToken);
      sessionStorage.setItem('userData', JSON.stringify(newUser));

      if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, {
              secure: true,
              sameSite: "Strict",
              expires: 1,
          });
      }
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { username, password });
      const token = res.data.accessToken;

      setAccessToken(token);
      localStorage.setItem("token", token);
      
      localStorage.setItem("Refresh Token", res.data.refreshToken);

      Cookies.set("refreshToken", res.data.refreshToken, {
        secure: false,
        sameSite: "Strict",
        expires: 1,
      });

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null); 
    localStorage.removeItem("token");
    sessionStorage.removeItem("userData");
    Cookies.remove("refreshToken");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`, { withCredentials: true });
      const newToken = res.data.accessToken;

      setAccessToken(newToken);
      localStorage.setItem("token", newToken);

      return newToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, login, logout, refreshAccessToken, setAuthState}}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => useContext(AuthContext);