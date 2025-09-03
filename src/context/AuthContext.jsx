import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('user');
    console.log("AuthContext: Initializing user from localStorage. Stored user raw:", storedUser);
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    console.log("AuthContext: Initializing user from localStorage. Parsed user:", initialUser);
    // Removed user settings fields like theme, notificationPreferences, otherSetting
    return initialUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const bookRide = async (ride) => {
    try {
      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not available.");
      }
      const response = await axios.post(`http://localhost:5000/api/users/${user._id}/book-ride`, { rideId: ride._id });
      const updatedUser = response.data.user;
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error("Error booking ride:", error);
      throw error;
    }
  };

  const login = (userData) => {
    console.log("AuthContext: User data received on login:", userData);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const fetchUser = async () => {
    if (!user || !user._id) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user._id}`);
      const fetchedUser = response.data.user;
      setUser(fetchedUser);
      localStorage.setItem('user', JSON.stringify(fetchedUser));
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Optionally, handle error, e.g., log out user if session is invalid
    }
  };

  const updateUser = async (updatedData) => {
    try {
      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not available.");
      }
      const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, updatedData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const cancelRide = async (rideId) => {
    try {
      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not available.");
      }
      const response = await axios.delete(`http://localhost:5000/api/users/${user._id}/cancel-ride/${rideId}`);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Error cancelling ride:", error);
      throw error;
    }
  };

  const cancelOfferedRide = async (rideId) => {
    try {
      if (!user || !user._id) {
        throw new Error("User not logged in or user ID not available.");
      }
      const response = await axios.delete(`http://localhost:5000/api/users/${user._id}/cancel-offered-ride/${rideId}`);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Error cancelling offered ride:", error);
      throw error;
    }
  };

  const value = { user, isAuthenticated: !!user, login, logout, bookRide, bookedRides: user?.bookedRides || [], updateUser, cancelRide, cancelOfferedRide };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
