import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormValidatorsSchema as schema } from './LoginFormValidators';
import { useState } from 'react';
import login from '../Auth/Login';
import GoogleAuth from './GoogleAuth';
import { Button, Modal } from '../Common';
import { ValidationIcon } from '../Common/Icons';

const LoginModal = ({ show, onHide, onRegistrationClick }) => {
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
            title='Log in'>
            <div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    id='signup-form'
                    disabled={isLoading}>
                    <input
                        className={(error || errors.email) ? "error" : ""}
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        onFocus={() => setError(null)}
                        onBlur={() => setError(null)} />
                    <input
                        className={(error || errors.password) ? "error" : ""}
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        onFocus={() => setError(null)}
                        onBlur={() => setError(null)} />
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
                    form='signup-form'
                    type='submit'
                    btnType='lg-modal'
                    raised
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading || setOfErrors.length > 0 || error}>
                    Log In
                </Button>
            </div>
            <p className="link-out tac">
                Do not have an account?
                <Button
                    btnType='sm-modal'
                    onClick={() => {
                        onRegistrationClick();
                        reset();
                    }}>
                    Sing up</Button>
            </p>
        </Modal >
    )
}

export default LoginModal;