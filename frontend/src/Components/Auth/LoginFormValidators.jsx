import * as yup from "yup";

export const LoginFormValidatorsSchema = yup.object({
    email: yup.string()
        .email('email address must be valid')
        .required(),
    password: yup.string()
        .min(8, 'the password is too short')
        .max(15,)
        .required(),
}).required();
