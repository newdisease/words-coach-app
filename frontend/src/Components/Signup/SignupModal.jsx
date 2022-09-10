import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { SignupFormValidatorsSchema as schema } from './SignupFormValidators';
import { useState } from 'react';
import login from '../Auth/Login';
import GoogleAuth from '../Auth/GoogleAuth';
import { Button, Modal } from '../Common';
import { ValidationIcon } from '../Common/Icons';


const SignupModal = ({ show, onHide, onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState(null);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    const setOfErrors = Object.values(errors);

    const onSubmit = ({ email, password1, password2 }) => {
        setIsLoading(true);
        axios
            .post("accounts/registration/", { email, password1, password2 })
            .then(() => {
                login(email, password1)
                    .then(() => {
                        onHide();
                        reset();
                        setIsLoading(false);
                    })
                    .catch(error => {
                        setIsLoading(false);
                        throw error;
                    })
            })
            .catch(error => {
                const errorEmail = error.response.data.email;
                const errorPassword = error.response.data.password1;
                if (errorEmail) {
                    setSignupError('email already exists');
                }
                if (errorPassword) {
                    setSignupError('too common password');
                }
                setIsLoading(false);
                throw error;
            })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            title='Sign up'>
            <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    id='login-form'
                    disabled={isLoading}>
                    <input
                        className={(signupError || errors.email) ? "error" : ""}
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        onFocus={() => {
                            setSignupError(null);
                            setError(null);
                        }} />
                    <input
                        className={(signupError || errors.password1) ? "error" : ""}
                        type="password"
                        placeholder="Password"
                        {...register("password1")}
                        onFocus={() => {
                            setSignupError(null)
                        }} />
                    <input
                        className={(signupError || errors.password2) ? "error" : ""}
                        type="password"
                        placeholder="Repeat password"
                        {...register("password2")}
                        onFocus={() => {
                            setSignupError(null)
                        }} />
                </form>
                <div className="modal--validation-wrapper">
                    {setOfErrors[0]?.message && <div className="flex"><ValidationIcon /> {setOfErrors[0]?.message}</div>}
                    {signupError && <div className="flex"><ValidationIcon /> {signupError}</div>}
                    {error && <div className="flex"><ValidationIcon /> {error}</div>}
                </div>
            </div>
            <div className='modal--controls flex flex-j-b'>
                <GoogleAuth
                    onHide={onHide}
                    setError={setError} />
                <Button
                    form='login-form'
                    type='submit'
                    btnType='lg-modal'
                    raised
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading || setOfErrors.length > 0 || signupError}>
                    Log In
                </Button>
            </div>
            <p className="link-out tac">
                Already have an accout?
                <Button
                    btnType='sm-modal'
                    onClick={() => {
                        onLogin();
                        reset();
                    }}>
                    Log in</Button>
            </p>
        </Modal >
    )
}

export default SignupModal;
