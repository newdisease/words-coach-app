import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { loginSetToken, loginSetUser } from "./AuthSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginFormValidatorsSchema as schema } from './LoginFormValidators';
import { useState } from 'react';

const Login = ({ show, onHide }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = ({ email, password }) => {
        setIsLoading(true);
        axios
            .post("http://127.0.0.1:8000/api/accounts/token/login/", { email, password })
            .then((response) => {
                const token = response.data['auth_token'];
                dispatch(loginSetToken(token));
                localStorage.setItem("authTokens", token);
                axios.defaults.headers.common["Authorization"] = "Token " + token;
                axios.get("http://127.0.0.1:8000/api/accounts/users/me/").then((response) => {
                    dispatch(loginSetUser(response.data));
                    localStorage.setItem("user", JSON.stringify(response.data));
                    onHide();
                    reset();
                    setIsLoading(false);
                })
                    .catch(error => {
                        setError("Something went wrong");
                    })
            })
            .catch(error => {
                setError("Something went wrong");
            });

    }
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Log in
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)} disabled={isLoading}>
                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" {...register("email")} />
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.email?.message}</p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" {...register("password")} />
                            <p style={{ minHeight: "1.5em" }} className="text-danger">{errors.password?.message}</p>
                        </Form.Group>
                        <Button className='col-sm-5 mx-auto' type="submit" variant="primary" size="lg">Login</Button>
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

export default Login;