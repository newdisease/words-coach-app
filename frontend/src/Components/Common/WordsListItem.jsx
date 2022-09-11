import { Button } from '../Common';
import { TrashIcon, ResetIcon } from './Icons';
import { capitalizeFirstLetter } from './utils';

import classnames from 'classnames';
import './WordsListItem.scss';


const MAX_PROGRESS = 3;

const WordsListItem = ({
  item,
  onDeleteItem,
  onUpdateItem,
  isLoading,
  isBlue,
}) => {
  const { id, en_word, uk_word, progress } = item;

  const handleCardSubmit = (id) => {
    setTimeout(() => {
      onDeleteItem(id);
    }, 500);
  }

  return (
    <li className={classnames('flex flex-j-b item-wrapper', { 'item-wrapper-blue': isBlue })}>
      <div className='item'>
        <p className='item-title'>{capitalizeFirstLetter(uk_word)}</p>
        <p className='item-content'>{en_word}</p>
      </div>
      <div className='flex controls-wrapper'>
        {progress >= 0 &&
          <div className='flex item-progress'>
            <div className='flex item-progress-bar'>
              {[...Array(MAX_PROGRESS)].map((item, key) =>
                <span className={classnames('dot', {
                  'dot-grey': (key + 1) > progress,
                  'dot-blue': progress === MAX_PROGRESS,
                })} key={key}></span>
              )}
            </div>
            <p className='tac'>{progress}/{MAX_PROGRESS} </p>
          </div>
        }
        {onUpdateItem &&
          <Button
            className='icon-blue'
            btnType='icon'
            onClick={() => onUpdateItem(id)}
          >
            <ResetIcon />
          </Button>
        }
        <Button
          className='icon-red'
          btnType='icon'
          onClick={(e) => {
            e.target.closest('.item-wrapper').classList.add('deleted');
            handleCardSubmit(id);
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </li>
  )
}

export default WordsListItem;
