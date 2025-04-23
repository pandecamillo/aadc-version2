import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import connection from "../data/connection";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect(connection);


export const AuthContext = createContext();
function AuthContextProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("membre")) || null
  );
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const login = async (inputs) => {
    const res = await axios.post(connection + "/login/" + inputs);
    res.data.membre ? setUser(res.data.membre) : setUser(null);
    return res;
  };

  const logout = () => {
    setUser(null);
  };

  const update = async (inputs) => {
    const res = await axios.post(connection + "/login/" + inputs);
    if (res.data.membre) setUser(res.data.membre);
  };

  useEffect(() => {
    localStorage.setItem("membre", JSON.stringify(user));
    if (user && user.theme == "sombre") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [user]);

  const verifyUser = async () => {
    if (user) {
      login(user.id);
    }
  };
  
  socket.on('membre', () => {
    verifyUser()
  })
  

  return (
    <AuthContext.Provider value={{ user, login, logout, update }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
