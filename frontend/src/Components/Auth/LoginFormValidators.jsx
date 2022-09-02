import * as yup from "yup";

export const LoginFormValidatorsSchema = yup.object({
    email: yup.string()
        .email('Email address must be valid')
        .required(),
    password: yup.string()
        .min(8, 'The password is too short')
        .max(15, 'The password is too long')
        .required(),
}).required();
