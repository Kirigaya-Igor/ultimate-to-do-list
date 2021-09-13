import React, {FC, useContext, useState} from 'react'
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {FormItem} from "../common/CustomField";
import './registrationPage.scss'
import {NavLink, Redirect} from "react-router-dom";
// @ts-ignore
import arrow from './arrow.png'
import {APIMethods} from "../../API/API";
import {AuthContext} from "../IsAuth/IsAuth";
import {Loader} from "../Loader/Loader";
import {AlertContext} from "../alert/alertState";
import {catchError} from "../common/catchError";

export const RegistrationPage: FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    // @ts-ignore
    const {currentUser, setCurrentUser} = useContext(AuthContext);
    // @ts-ignore
    const {showAlert} = useContext(AlertContext);

    if (currentUser) {
        return <Redirect to="/main"/>;
    }

    type valuesType = {
        username: string,
        email: string,
        password: string
    }

    const registration = (values: valuesType) => {
        setIsLoading(true)
        const newUser = {
            username: values.username,
            email: values.email,
            password: values.password
        }

        try {
            APIMethods.register(newUser)
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

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(4, '"Username" cannot be shorter than 4 characters')
            .required('The field "Username" is required'),
        email: Yup.string().min(6, '"Email" cannot be shorter than 6 characters')
            .required('The field "Email" is required')
            .email('The field "Email" is not valid'),
        password: Yup.string().min(5, '"Password" cannot be shorter than 5 characters')
            .required('The field "Password" is required'),
        repeatPassword: Yup.string().required('The field "Repeat password" is required')
            .oneOf([Yup.ref('password')], 'Passwords mismatch')
    })

    return (
        <div className='registrationPage'>
            <div className='container-fluid'>
                <div className='row d-flex justify-content-center'>
                    {isLoading ? <Loader/>
                        :
                        <div className='col-md-5 registrationPageContent'>
                            <NavLink className='customLink' to='login'>
                                <img src={arrow} alt='arrow'/>
                            </NavLink>
                            <div className='col-12 d-flex justify-content-center align-items-center'>
                                <h4 className='pageTitle'>Create an new account</h4>
                            </div>

                            <div className='col-12'>
                                <Formik
                                    initialValues={{username: "", email: "", password: "", repeatPassword: ""}}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, {resetForm}) => {
                                        registration(values)
                                        resetForm({})
                                    }}
                                >
                                    {({isValid, errors, dirty, ...props}) => (
                                        <div className='container-fluid'>
                                            <div className='row d-flex justify-content-center'>
                                                <div className='col-xl-10'>
                                                    <Form className='d-flex flex-column m-3'>
                                                        <FormItem itemId='Username' placeholder='Username'
                                                                  itemType='text'
                                                                  itemName='username' important={true} errors={errors}/>
                                                        <FormItem itemId='Email' placeholder='Email' itemType='email'
                                                                  itemName='email' important={true} errors={errors}/>
                                                        <FormItem itemId='Password' placeholder='Password'
                                                                  itemType='password'
                                                                  itemName='password' important={true} errors={errors}/>
                                                        <FormItem itemId='RepeatPassword' placeholder='Repeat password'
                                                                  itemType='password'
                                                                  itemName='repeatPassword' important={true}
                                                                  errors={errors}/>
                                                        <div className='d-flex justify-content-center'>
                                                            <button type="submit" disabled={!isValid || !dirty}
                                                                    className="submitButton btn mt-2">Create
                                                            </button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}