import * as yup from "yup";

export const SignupFormValidatorsSchema = yup.object({
    email: yup.string()
        .email("must be a valid email address")
        .required(),
    password: yup.string()
        .min(8, 'must be at least 8 characters long')
        .max(15, 'an expression is too long')
        .required(),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'passwords must match')
        .required("must confirm password"),
}).required();
