import { useState, useEffect } from 'react';
import classNames from 'classnames';
import './Alert.scss';


const Alert = ({ type, message, timer = 3000 }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(true);
    setTimeout(() => {
      setIsShow(false);
    }, timer);
  }, []);
  if (!isShow) return null;
  return (
    <div className={classNames('alert', `alert--${type}`)}>
      {message}
    </div>
  );
}

export default Alert;
