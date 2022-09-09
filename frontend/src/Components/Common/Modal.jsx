import { CloseIcon } from './Icons';
import { Button } from '../Common';

import './Modal.scss';

const Modal = ({
  children,
  show,
  onHide,
  title = 'Log in',
}) => {

  if (!show) {
    return null;
  }

  return (
    <div className='modal flex'>
      <div className='modal--overlay' onClick={onHide}></div>
      <div className='modal--content'>
        <div className='modal--close'>
          <Button
            className='icon-black'
            onClick={onHide}
            btnType='close-btn'
          >
            <CloseIcon />
          </Button>
        </div>
        <div className='modal--title tac'>{title}</div>
        <div className='modal--body flex flex-j-b'>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
