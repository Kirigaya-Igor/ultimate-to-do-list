import React, {useContext} from 'react';
import {AlertContext} from "./alertState";
import './alert.scss';

export const Alert: React.FC = () => {

    // @ts-ignore
    const {isVisible, hideAlert, alertMsg, alertSuccess} = useContext(AlertContext);

    if (!isVisible) {
        return null
    }

    return (
        <div className={`alert alert-dismissible fixed-top ${alertSuccess ? 'alert-success' : 'alert-warning'}`}>
            {alertSuccess ? <strong>Success!</strong> : <strong>Warning!</strong>}
            &nbsp;{alertMsg}
            <button onClick={hideAlert} type="button" className="btn-close" aria-label="Close"></button>
        </div>
    )
}