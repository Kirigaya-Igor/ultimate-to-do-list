import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

export const firebaseInit = initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

// @ts-ignore
export const FirebaseContext = React.createContext();

export const FirebaseProvider: React.FC = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<any>(false);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user)
            }
        })
    }, [auth])

    return (
        <FirebaseContext.Provider value={{currentUser, setCurrentUser, auth}}>
            {children}
        </FirebaseContext.Provider>
    );
};