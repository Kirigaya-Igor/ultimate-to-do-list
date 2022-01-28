import React from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {DataPage} from "./components/DataPage/DataPage";
import {LoginPage} from './components/LoginPage/LoginPage';
import {RegistrationPage} from "./components/RegistrationPage/RegistrationPage";
import {AppHeader} from "./components/AppHeader/AppHeader";
import {AlertState} from './components/alert/alertState';
import {Alert} from "./components/alert/alert";
import { FirebaseProvider } from './components/Firebase/FirebaseProvider';

function App() {
    return (
        <div>
            <AlertState>
                <FirebaseProvider>
                    <HashRouter>
                        <AppHeader/>
                        <Alert/>
                        <Switch>
                            <Route path='/main' component={DataPage}/>
                            <Route exact path='/login' component={LoginPage}/>
                            <Route exact path='/registration' component={RegistrationPage}/>
                            <Redirect to={"/main"}/>
                        </Switch>
                    </HashRouter>
                </FirebaseProvider>
            </AlertState>
        </div>
    );
}

export default App;
