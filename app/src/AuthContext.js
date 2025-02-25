import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserData(token); 
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const res = await axios.get("http://localhost:5000/user", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ token, ...res.data });
        } catch (error) {
            console.error("Error fetching user data", error);
            setUser(null);
        }
    };

    const login = async (token) => {
        localStorage.setItem("token", token);
        await fetchUserData(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
