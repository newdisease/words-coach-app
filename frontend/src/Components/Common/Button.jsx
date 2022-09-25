import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import "./Button.scss";

const Button = ({
  children,
  onClick,
  className,
  raised,
  outline,
  btnType,
  type = "button",
  linkTo,
  bubbleCount,
  ...rest
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={linkTo ? () => navigate(linkTo) : onClick}
      className={classNames("button", className, {
        "button-raised": raised,
        "button-outline": outline,
        [`button--${btnType}`]: btnType,
      })}
      type={type}
      {...rest}
    >
      {(bubbleCount || bubbleCount === 0) && (
        <span className="bubble">
          <span>{bubbleCount}</span>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
