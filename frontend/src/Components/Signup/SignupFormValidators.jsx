import * as yup from "yup";

export const SignupFormValidatorsSchema = yup.object({
    email: yup.string()
        .email("must be a valid email address")
        .required(),
    password1: yup.string()
        .min(8, 'must be at least 8 characters long')
        .max(15, 'an expression is too long')
        .required(),
    password2: yup.string()
        .oneOf([yup.ref('password1'), null], 'passwords must match')
        .required("must confirm password"),
}).required();
