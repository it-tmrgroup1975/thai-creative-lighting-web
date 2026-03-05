import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api"; // Axios instance ของคุณ

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials: any) => {
    const res = await api.post("/login.php", credentials);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};