import React, {FC, useEffect, useState} from "react";

// @ts-ignore
export const AuthContext = React.createContext();

export const AuthProvider: FC = ({children}) => {
    const [currentUser, setCurrentUser] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setCurrentUser(true)
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                setCurrentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};