import * as yup from "yup";

export const SignupFormValidatorsSchema = yup.object({
    email: yup.string()
        .email('email address must be valid')
        .required(),
    password1: yup.string()
        .min(8, 'the password is too short')
        .max(15, 'the password is too long')
        .required(),
    password2: yup.string()
        .oneOf([yup.ref('password1'), null], 'passwords must match')
        .required(),
}).required();
