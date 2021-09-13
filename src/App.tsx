import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {DataPage} from "./components/DataPage/DataPage";
import {LoginPage} from './components/LoginPage/LoginPage';
import {RegistrationPage} from "./components/RegistrationPage/RegistrationPage";
import {AppHeader} from "./components/AppHeader/AppHeader";
import {AuthProvider} from "./components/IsAuth/IsAuth";
import {AlertState} from './components/alert/alertState';
import {Alert} from "./components/alert/alert";

function App() {
    return (
        <div>
            <AlertState>
                <AuthProvider>
                    <BrowserRouter>
                        <AppHeader/>
                        <Alert/>
                        <Switch>
                            <Route path='/main' component={DataPage}/>
                            <Route exact path='/login' component={LoginPage}/>
                            <Route exact path='/registration' component={RegistrationPage}/>
                            <Redirect to={"/main"}/>
                        </Switch>
                    </BrowserRouter>
                </AuthProvider>
            </AlertState>
        </div>
    );
}

export default App;
