import React, {createContext, useState} from 'react';

// @ts-ignore
export const AlertContext = createContext();

export const AlertState: React.FC = ({children}) => {

    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false)
    const [alertMsg, setAlertMsg] = useState<string>('')

    const showAlert = (alertMsg: string, alertSuccess?: boolean) => {
        setAlertMsg(alertMsg)
        setIsVisible(true)
        alertSuccess && setAlertSuccess(alertSuccess)
        setTimeout(hideAlert, 5000);
    }

    const hideAlert = () => {
        setIsVisible(false)
        setAlertSuccess(false)
    }

    return (
        <AlertContext.Provider value={{showAlert, hideAlert, alertMsg, isVisible, alertSuccess}}>
            {children}
        </AlertContext.Provider>
    )
}