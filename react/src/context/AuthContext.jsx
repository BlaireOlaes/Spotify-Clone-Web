import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Route, Navigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [errors, setError] = useState([]);
  const navigate = useNavigate();
  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/user");
      setUser(data);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // console.log("User not authenticated.");
      } else {
        setError(["Error while fetching user:", error.message]);
      }
    }
  };

  

  const login = async ({ ...data }) => {
    await csrf();
    setError([]);
    try {
      await axios.post("/login", data);
      const userData = await getUser();
      if (userData?.superadmin) {
        navigate("/statistic");
      } else if (userData?.artist) {
        navigate("/artist");
      } else {
        navigate("/");
      }
      return { success: true };
    } catch (e) {
      if (e.response.status === 422) {
        setError(e.response.data.errors);
        return { success: false };
      }
    }
  };

  const register = async ({ ...data }) => {
    await csrf();
    setError([]);
    try {
      await axios.post("/register", data);
      await getUser();
      navigate("/");
      return { success: true };
    } catch (e) {
      if (e.response.status === 422) {
        setError(e.response.data.errors);
      }
      return { success: false };
    }
  };

  const logout = async () => {
    await axios.post("/logout");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, errors, getUser, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
