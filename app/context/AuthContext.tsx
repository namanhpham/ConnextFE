'use client'

import { createContext, useContext } from "react"

interface AuthProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext(null)

const AuthProvider = ({ children }: AuthProviderProps) => {

    return (
        <AuthContext.Provider value={null}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
