import { useForm } from "react-hook-form";
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormValidatorsSchema as schema } from './LoginFormValidators';
import { useState, useEffect } from 'react';
import login from '../Auth/Login';
import GoogleAuth from './GoogleAuth';
import { Button, Modal, Alert } from '../Common';
import { ValidationIcon } from '../Common/Icons';

const LoginModal = ({ show, onHide }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });
    const setOfErrors = Object.values(errors);

    const onSubmit = ({ email, password }) => {
        setError(null);
        setIsLoading(true);
        login(email, password)
            .then(() => {
                onHide();
                reset();
                setIsLoading(false);
            })
            .catch(error => {
                setError("Invalid email or password");
                setIsLoading(false);
                throw error;
            })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            title="Log in"
        >
            <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    disabled={isLoading}
                >
                    <input
                        className={(error || errors.email) ? "error" : ""}
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        onFocus={() => setError(null)}
                    />
                    <input
                        className={(error || errors.password) ? "error" : ""}
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        onFocus={() => setError(null)}
                    />
                </form>
                <div className="modal--validation-wrapper">
                    {setOfErrors[0]?.message && <div className="flex"><ValidationIcon /> {setOfErrors[0]?.message}</div>}
                    {error && <div className="flex"><ValidationIcon /> {error}</div>}
                </div>
            </div>
            <div className='modal--controls flex flex-j-b'>
                <GoogleAuth
                    onHide={onHide}
                    setError={setError} />
                <Button
                    btnType="lg-modal"
                    raised
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading || setOfErrors.length > 0 || error}
                >
                    Log In
                </Button>
            </div>
        </Modal >
    )
}

export default LoginModal;