import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext(null);
const USER_TOKEN_KEY = 'campusnest_user_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      if (error.response?.status === 401) localStorage.removeItem(USER_TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const requestSignupOtp = async (values) => {
    const { data } = await api.post('/auth/signup/request-otp', values);
    return data;
  };

  const completeSignup = async (values) => {
    const { data } = await api.post('/auth/signup/verify', values);
    if (data.token) localStorage.setItem(USER_TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  };

  const login = async (values) => {
    const { data } = await api.post('/auth/login', values);
    if (data.token) localStorage.setItem(USER_TOKEN_KEY, data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(USER_TOKEN_KEY);
      setUser(null);
    }
  };

  const applyChatUsage = (chatUsage) => {
    if (!chatUsage) return;
    setUser((current) => current ? {
      ...current,
      freeChatUsed: chatUsage.freeChatUsed,
      freeChatCount: chatUsage.freeChatCount,
      remainingFreeMessages: chatUsage.remainingFreeMessages,
      chatCredits: chatUsage.chatCredits,
      totalChatMessages: chatUsage.totalChatMessages
    } : current);
  };

  const value = useMemo(() => ({
    user,
    loading,
    requestSignupOtp,
    completeSignup,
    login,
    logout,
    applyChatUsage,
    refreshUser
  }), [loading, refreshUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
};
