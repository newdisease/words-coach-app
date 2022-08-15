import { useState, useEffect, useCallback } from 'react';
import { CORRECT, INCORRECT, IN_PROGRESS, COMPLETE } from './QuizConstants';

const InputBox = ({
  type,
  handleKeyDown,
  handleChange,
  handleFocus,
  name,
  inputRef,
  replyStatus
}) => {
  let color;
  if (replyStatus === CORRECT) { color = 'green' }
  else if (replyStatus === INCORRECT) { color = 'red' }

  return (
    <input
      style={{
        width: "35px",
        height: "35px",
        margin: "5px",
        textAlign: "center",
        fontSize: "1.5rem",
        borderColor: color,
        borderStyle: "solid",
      }}
      className="justify-content: space-between"
      type={type}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onFocus={handleFocus}
      maxLength='1'
      name={name}
      ref={inputRef}
      readOnly={replyStatus !== IN_PROGRESS}
      hidden={replyStatus === COMPLETE}
    />
  )
}

const QuizInput = ({ amount, replyStatus, setAnswer }) => {
  const [characterArray, setCharacterArray] = useState(Array(amount).fill(null))
  const inputElements = {}

  useEffect(() => {
    inputElements['input0']?.select()
  }, [amount])


  const renderItems = () => {
    let items = []
    for (let i = 0; i < amount; i++) {
      items.push(
        <InputBox
          key={i}
          type='text'
          handleKeyDown={handleKeyDown}
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
      if (target.value === '' && target.previousElementSibling !== null) {
        target.previousElementSibling.value = ''
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
    const el = target
    // In most browsers .select() does not work without the added timeout.
    setTimeout(function () {
      el.select()
    }, 0)
  }, [])

  const focusPrevChar = useCallback((target) => {
    if (target.previousElementSibling !== null) {
      target.previousElementSibling.focus()
    }
  }, [])

  const focusNextChar = useCallback((target) => {
    if (target.nextElementSibling !== null) {
      target.nextElementSibling.focus()
    }
  }, [])

  const setModuleOutput = useCallback(() => {
    const characterArray = Array(amount).fill(null)
    const updatedCharacters = characterArray.map((character, number) => {
      return inputElements['input' + number].value
    })
    setAnswer(updatedCharacters.join(''))
    setCharacterArray(updatedCharacters)
  }, [amount, characterArray, inputElements])

  return (
    <div style={{ "minHeight": "15vh" }} className="my-2">
      <div>{renderItems()}</div>
    </div>
  )
}

export default QuizInput
