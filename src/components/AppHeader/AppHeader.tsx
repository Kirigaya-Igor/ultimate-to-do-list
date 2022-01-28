import { signOut } from "firebase/auth";
import React, { FC, useContext } from 'react';
import { FirebaseContext } from '../Firebase/FirebaseProvider';
import './appHeader.scss';

export const AppHeader: FC = () => {

    // @ts-ignore
    const {currentUser, setCurrentUser, auth} = useContext(FirebaseContext)

    const logout = () => {
        signOut(auth).then(() => {
            setCurrentUser(false)
            localStorage.removeItem('userId')
          }).catch((error) => {
            console.log('log out error')
          });
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