import './Title.scss'
import classnames from 'classnames'

const Title = ({
  text = "Learning words",
  childrenComponent
}) => {

  return (
    <div className='flex flex-justify-between title-wrapper'>
      <div className={classnames('title', { 'tac': !childrenComponent })}>
        <h1>{text}</h1>
        <p className="subtitle">
          🇬🇧&nbsp;&nbsp;English <span>/</span> Ukrainian&nbsp;&nbsp;🇺🇦
        </p>
      </div>
      {childrenComponent && <div>{childrenComponent}</div>}
    </div>
  )
}

export default Title;
