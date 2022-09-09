import { useState, useEffect } from 'react';
import { Button } from '../Common';
import { CloseIcon } from './Icons';
import classNames from 'classnames';
import './Alert.scss';


const Alert = ({ message, timer = 5000 }) => {
  const [isShow, setIsShow] = useState(false);

  const onClose = () => {
    document.getElementsByClassName('alert')[0].classList.add('deleted');
    setTimeout(() => {
      setIsShow(false);
    }, 500);
  }

  useEffect(() => {
    setIsShow(true);
    setTimeout(() => {
      onClose();
    }, timer - 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isShow) return null;

  return (
    <div className={classNames('alert')}>
      <div className='alert--content flex flex-j-b'>
        <div className='alert--message'>{message}</div>
        <div className='alert--close'>
          <Button
            className='icon-blue'
            onClick={() => onClose()}
            btnType='icon'
          >
            <CloseIcon />
          </Button>
        </div>
      </div>
      <div className='alert--progress'>
        <span
          className='colorized-line'
          style={{
            "--sec": timer / 1000 + 's',
          }}></span>
      </div>
    </div>
  );
}

export default Alert;
