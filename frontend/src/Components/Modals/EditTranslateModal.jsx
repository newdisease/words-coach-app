import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Modal } from "../Common";
import { ValidationIcon } from "../Common/Icons";
import { capitalizeFirstLetter } from "../Common/utils";

import * as yup from "yup";

const schema = yup
  .object({
    expression: yup
      .string()
      .min(2, "must be at least 2 characters long")
      .max(15, "an expression is too long")
      .matches(/^([^\s]*[\s]?[^\s]*){0,2}$/, {
        message: "too many words in the expression",
      })
      .matches(/^[а-яА-Яa-zA-Z\sіІїЇєЄ`']+$/, {
        message: "only letters are allowed",
      }),
  })
  .required();

const EditTranslateModal = ({
  show,
  onHide,
  translatedWord,
  setTranslatedWord,
  language,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  let wordKey;
  if (language === "EN") {
    wordKey = "ukWord";
  } else {
    wordKey = "enWord";
  }

  const onSubmit = ({ expression }) => {
    setTranslatedWord({
      ...translatedWord,
      [wordKey]: capitalizeFirstLetter(expression.toLowerCase()),
    });
    reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} title="Edit Word">
      <div className="initial-word tac">{translatedWord[wordKey]}</div>
      <form id="editword-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          className={errors.expression ? "error" : ""}
          type="text"
          placeholder="Your translation"
          {...register("expression")}
        />
      </form>
      <div className="modal--validation-wrapper">
        {errors.expression && (
          <div className="flex">
            <ValidationIcon /> {errors.expression?.message}
          </div>
        )}
      </div>
      <div className="modal--controls tac">
        <Button
          form="editword-form"
          type="submit"
          btnType="lg-modal"
          raised
          onClick={handleSubmit(onSubmit)}
          disabled={errors.expression}
        >
          Apply
        </Button>
      </div>
    </Modal>
  );
};

export default EditTranslateModal;
