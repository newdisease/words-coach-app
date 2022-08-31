import * as yup from "yup";

export const WordsSearchFormValidatorsSchema = yup.object({
    expression: yup.string()
        .min(2, 'must be at least 2 characters long')
        .max(15, 'an expression is too long')
        .matches(/^([^\s]*[\s]?[^\s]*){0,2}$/, { message: "too many words in the expression" })
        .matches(/^[а-яА-ЯіІїЇa-zA-Z\s']+$/, { message: "only letters are allowed" }),
}).required();
