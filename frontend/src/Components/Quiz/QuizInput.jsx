import { useState, useEffect, useCallback } from 'react';
import { CheckIcon, CloseIcon } from '../Common/Icons';
import { CORRECT, INCORRECT, IN_PROGRESS, COMPLETE } from './QuizConstants';

const InputBox = ({
  type,
  handleChange,
  handleFocus,
  name,
  inputRef,
  replyStatus
}) => {
  let answeredColorClass = ''
  if (replyStatus === CORRECT) {
    answeredColorClass = ' correct'
  } else if (replyStatus === INCORRECT) {
    answeredColorClass = ' error'
  }

  return (
    <span
      className={`quiz-input tac${answeredColorClass}`}>
      <input
        className='tac'
        type={type}
        onChange={handleChange}
        onFocus={handleFocus}
        maxLength='1'
        name={name}
        ref={inputRef}
        readOnly={replyStatus !== IN_PROGRESS}
        hidden={replyStatus === COMPLETE}
        placeholder=' '
      />
      <span className='line'></span>
    </span>
  )
}

const QuizInput = ({ amount, replyStatus, setAnswer }) => {
  const [characterArray, setCharacterArray] = useState(Array(amount).fill(null))
  const inputElements = {}

  useEffect(() => {
    inputElements['input0']?.select()
  }, [amount])

  useEffect(() => {
    if (replyStatus === IN_PROGRESS) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [replyStatus])

  const renderItems = () => {
    let items = []
    for (let i = 0; i < amount; i++) {
      items.push(
        <InputBox
          key={i}
          type='text'
          handleChange={handleChange}
          handleFocus={handleFocus}
          name={`input${i}`}
          replyStatus={replyStatus}
          inputRef={el => {
            if (!el) return
            inputElements[`input${i}`] = el
          }}
        />
      )
    }
    return items
  }

  const handleChange = useCallback(({ target }) => {
    if (target.value.match(/^[а-яА-ЯіІїЇa-zA-Z\s' ]+$/)) {
      focusNextChar(target)
      setModuleOutput(target)
    } else {
      target.value = characterArray[target.name.replace('input', '')]
    }
  }, [characterArray])

  const handleKeyDown = useCallback(({ target, key }) => {
    if (key === 'Backspace') {
      const el = target.parentElement.previousElementSibling?.firstChild
      if (el && target.value === '') {
        el.value = ''
        focusPrevChar(target)
      } else {
        target.value = ''
      }
      setModuleOutput(target)
    } else if (key === 'ArrowLeft') {
      focusPrevChar(target)
    } else if (key === 'ArrowRight') {
      focusNextChar(target)
    }
    else if (key === 'Space') {
      focusNextChar(target)
    }
  }, [characterArray])

  const handleFocus = useCallback(({ target }) => {
    // In most browsers .select() does not work without the added timeout.
    setTimeout(function () {
      target.select()
    }, 0)
  }, [])

  const focusPrevChar = useCallback((target) => {
    target.parentElement.previousElementSibling?.firstChild?.focus()
  }, [])

  const focusNextChar = useCallback((target) => {
    target.parentElement.nextElementSibling?.firstChild?.focus()
  }, [])

  const setModuleOutput = useCallback(() => {
    const characterArray = Array(amount).fill(null)
    const updatedCharacters = characterArray.map((character, number) => {
      return inputElements['input' + number].value
    })
    setAnswer(updatedCharacters.join(''))
    setCharacterArray(updatedCharacters)
  }, [amount, characterArray, inputElements])

  const icons = {
    CORRECT: { renderClass: 'success', renderIcon: <CheckIcon /> },
    INCORRECT: { renderClass: 'error', renderIcon: <CloseIcon /> }
  }

  const { renderClass, renderIcon } = icons[replyStatus] || {}

  return (
    <div className='expression-wrap flex'>
      <div
        className='expression'
      >
        {renderItems()}
      </div>
      <div className={`icon ${renderClass}`}>
        {renderIcon}
      </div>
    </div>
  )
}

export default QuizInput
