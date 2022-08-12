import React, { Component } from 'react'
import { CORRECT, INCORRECT, IN_PROGRESS } from './Quiz'

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
        width: "40px",
        height: "40px",
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
    />
  )
}

class QuizInput extends Component {
  constructor(props) {
    super(props)
    this.state = { characterArray: Array(props.amount).fill(null) }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.inputElements = {}
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.inputElements['input0'].select()
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.amount !== nextProps.amount ||
      this.props.replyStatus !== nextProps.replyStatus
    ) {
      return true
    }
    return false
  }

  renderItems() {
    let items = []

    for (var i = 0; i < this.props.amount; i++) {
      items.push(
        <InputBox
          type="text"
          key={i}
          handleKeyDown={this.handleKeyDown}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          name={'input' + i}
          replyStatus={this.props.replyStatus}
          inputRef={el => {
            if (!el) return
            this.inputElements[el.name] = el
          }}
        />
      )
    }

    return items
  }

  render() {
    return (
      <div>
        <div>{this.renderItems()}</div>
      </div>
    )
  }

  handleChange({ target }) {
    if (target.value.match(/^[а-яА-ЯіІїЇa-zA-Z\s' ]+$/)) {
      this.focusNextChar(target)
      this.setModuleOutput(target)
    } else {
      target.value = this.state.characterArray[target.name.replace('input', '')]
    }
  }

  handleKeyDown({ target, key }) {
    if (key === 'Backspace') {
      if (target.value === '' && target.previousElementSibling !== null) {
        target.previousElementSibling.value = ''
        this.focusPrevChar(target)
      } else {
        target.value = ''
      }
      this.setModuleOutput(target)
    } else if (key === 'ArrowLeft') {
      this.focusPrevChar(target)
    } else if (key === 'ArrowRight') {
      this.focusNextChar(target)
    }
    else if (key === 'Space') {
      this.focusNextChar(target)
    }
  }

  handleFocus({ target }) {
    var el = target
    // In most browsers .select() does not work without the added timeout.
    setTimeout(function () {
      el.select()
    }, 0)
  }

  focusPrevChar(target) {
    if (target.previousElementSibling !== null) {
      target.previousElementSibling.focus()
    }
  }

  focusNextChar(target) {
    if (target.nextElementSibling !== null) {
      target.nextElementSibling.focus()
    }
  }

  setModuleOutput() {
    this.setState(() => {
      const characterArray = Array(this.props.amount).fill(null)
      const updatedCharacters = characterArray.map((character, number) => {
        return this.inputElements['input' + number].value
      })

      return { characterArray: updatedCharacters }
    }, () => this.props.handleOutputString(this.state.characterArray.join('')))
  }
}

export default QuizInput