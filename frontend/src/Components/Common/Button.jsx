import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import './Button.scss';

const Button = ({
  children,
  onClick,
  className,
  disabled,
  form,
  raised,
  outline,
  btnType,
  type = "button",
  linkTo,
  bubbleCount
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={linkTo ? () => navigate(linkTo) : onClick}
      className={classNames('button', className, {
        'button--raised': raised,
        'button--outline': outline,
        [`button--${btnType}`]: btnType,
      })
      }
      disabled={disabled}
      type={type}
      form={form}
    >
      {
        (bubbleCount || bubbleCount === 0) && <span className="bubble">
          <span>{bubbleCount}</span>
        </span>
      }
      {children}
    </button>
  );
}

export default Button;
