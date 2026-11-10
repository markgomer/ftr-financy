import { createContext, useContext, useState, type ReactNode } from "react";
import { client, TOKEN_KEY } from "./apollo";

type AuthContextType = {
    isAuthenticated: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

    const signIn = (newToken: string) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
    };

    const signOut = () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        client.clearStore();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
