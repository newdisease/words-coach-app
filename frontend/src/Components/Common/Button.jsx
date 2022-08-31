import classNames from 'classnames';
import './Button.scss';

const Button = ({
  children,
  onClick,
  className,
  disabled,
  raised,
  btnType,
  type = "button",
  bubbleCount
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames('button', className, {
        'button--raised': raised,
        [`button--${btnType}`]: btnType,
      })
      }
      disabled={disabled}
      type={type}
    >
      {
        bubbleCount && <span className="bubble">
          <span>{bubbleCount}</span>
        </span>
      }
      {children}
    </button>
  );
}

export default Button;
