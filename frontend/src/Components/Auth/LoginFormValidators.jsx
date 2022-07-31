import * as yup from "yup";

export const LoginFormValidatorsSchema = yup.object({
    email: yup.string()
        .email("must be a valid email address")
        .required(),
    password: yup.string()
        .min(8, 'must be at least 8 characters long')
        .max(15, 'an expression is too long')
        .required(),
}).required();
