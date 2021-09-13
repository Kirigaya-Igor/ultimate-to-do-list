import React, {FC, useContext} from 'react'
import './appHeader.scss'
import {AuthContext} from "../IsAuth/IsAuth";
import {useHistory} from "react-router-dom";

export const AppHeader: FC = () => {

    // @ts-ignore
    const {currentUser, setCurrentUser} = useContext(AuthContext);
    const history = useHistory()

    const logout = () => {
        localStorage.removeItem('token')
        setCurrentUser(false)
        history.push('/login')
    }

    return (
        <div className='appHeader'>
            <div className='col-md-6 appHeaderContent'>
                ToDo-List
            </div>

            {currentUser && <button onClick={logout} className='logout'></button>}
        </div>
    )
}