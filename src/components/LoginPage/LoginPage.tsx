import React, {FC, useContext, useState} from 'react'
import {Form, Formik} from 'formik'
import {NavLink, Redirect} from 'react-router-dom'
import * as Yup from "yup"
import {FormItem} from '../common/CustomField'
import './loginPage.scss'
import {APIMethods} from "../../API/API";
import {AuthContext} from '../IsAuth/IsAuth'
import {Loader} from "../Loader/Loader";
import {AlertContext} from "../alert/alertState";
import {catchError} from "../common/catchError";

export const LoginPage: FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    // @ts-ignore
    const {currentUser, setCurrentUser} = useContext(AuthContext);
    // @ts-ignore
    const {showAlert} = useContext(AlertContext);

    if (currentUser) {
        return <Redirect to="/main"/>;
    }

    type valuesType = {
        login: string,
        password: string
    }

    const login = (values: valuesType) => {
        setIsLoading(true)
        const userData = {
            identifier: values.login,
            password: values.password
        }

        try {
            APIMethods.login(userData)
                .then((response) => {
                    setIsLoading(false)
                    // @ts-ignore
                    localStorage.setItem('token', response.data.jwt)
                    setCurrentUser(true)
                })
                .catch((error) => {
                    setIsLoading(false)
                    catchError(error, showAlert)
                })
        } catch (error: any) {
            setIsLoading(false)
            showAlert(`Some error has occurred, please try again. Error message: ${error.message}`)
        }
    }

    const validationSchema = Yup.object({
        login: Yup.string().min(4, '"Login" cannot be shorter than 4 characters')
            .required('The field "Login" is required'),
        password: Yup.string().min(5, '"Password" cannot be shorter than 5 characters')
            .required('The field "Password" is required')
    })

    return (
        <div className='loginPage'>
            <div className='container-fluid'>
                <div className='row d-flex justify-content-center'>
                    {isLoading ? <Loader/>
                        :
                        <div className='col-md-5 loginPageContent'>
                            <div className='col-12 d-flex justify-content-center'>
                                <h4 className='pageTitle'>Login</h4>
                            </div>

                            <div className='col-12'>
                                <Formik
                                    initialValues={{login: "", password: ""}}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, {resetForm}) => {
                                        login(values)
                                        resetForm({})
                                    }}
                                >
                                    {({isValid, errors, dirty, ...props}) => (
                                        <div className='container-fluid'>
                                            <div className='row d-flex justify-content-center'>
                                                <div className='col-xl-10'>
                                                    <Form className='d-flex flex-column m-3'>
                                                        <FormItem itemId='Login' placeholder='Email or Username'
                                                                  itemType='text'
                                                                  itemName='login' important={true} errors={errors}/>
                                                        <FormItem itemId='Password' placeholder='Password'
                                                                  itemType='password'
                                                                  itemName='password' important={true} errors={errors}/>
                                                        <div className='d-flex justify-content-center'>
                                                            <button type="submit" disabled={!isValid || !dirty}
                                                                    className="submitButton btn mt-3">Login
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Formik>
                            </div>

                            <div className='separatingText text-white d-flex justify-content-center'>
                                or
                            </div>

                            <div className='text-white d-flex justify-content-center'>
                                <NavLink className='customLink' to='registration'>create an account</NavLink>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}