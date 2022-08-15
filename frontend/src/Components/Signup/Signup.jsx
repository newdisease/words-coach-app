import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignupFormValidatorsSchema as schema } from './SignupFormValidators';
import { useState, useEffect } from 'react';


const Signup = ({ show, onHide }) => {
    const [isSent, setIsSent] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [signupError, setSignupError] = useState({
        emailError: null,
        passwordError: null
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        setTimeout(() => {
            setIsSent(false);
        }, 3000);
    }, [isSent]);

    const onSubmit = ({ email, password }) => {
        setIsSubmitted(true);
        axios
            .post("accounts/users/", { email, password })
            .then(() => {
                onHide();
                setIsSent(true);
                reset();
            })
            .catch(error => {
                setSignupError({
                    emailError: error.response.data.email,
                    passwordError: error.response.data.password
                });
            }
            );
        setIsSubmitted(false);
    }

    return (
        <>
            {<Alert
                variant="success"
                style={{ position: "absolute", top: "0", left: "0", width: "100%", zIndex: "1" }}
                className='d-flex justify-content-center mx-auto'
                show={isSent}>
                Success! Now you can login
            </Alert>}
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Registration
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)} disabled={isSubmitted}>
                        {signupError.emailError && <Alert variant="danger" onClose={() => setSignupError({ emailError: null })} dismissible>{signupError.emailError}</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" {...register("email")} />
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.email?.message}</p>
                        </Form.Group>
                        {signupError.passwordError && <Alert variant="danger" onClose={() => setSignupError({ passwordError: null })} dismissible>{signupError.passwordError}</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" {...register("password")} />
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.password?.message}</p>

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPasswordRepeated">
                            <Form.Label>Repeat password</Form.Label>
                            <Form.Control type="password" placeholder="Repeat password" {...register("confirmPassword")} />
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.confirmPassword?.message}</p>
                        </Form.Group>
                        <Button className='col-sm-5 mx-auto' type="submit" variant="primary" size="lg">Create account</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Signup;
