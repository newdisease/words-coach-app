import classNames from 'classnames';
import './Button.scss';

const Button = ({ children, onClick, className, disabled, raised, size }) => {
  return (
    <button
      onClick={onClick}
      className={classNames('button', className, {
        'button--raised': raised,
        [`button--${size}`]: size,
      })
      }
      disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
