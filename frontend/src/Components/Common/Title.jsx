import './Title.scss'
import classnames from 'classnames'

const Title = ({
  className,
  title = "Learning words",
  subtitle = <>🇬🇧&nbsp;&nbsp;English <span>/</span> Ukrainian&nbsp;&nbsp;🇺🇦</>,
  childrenComponent
}) => {

  return (
    <div className={classnames('flex flex-j-b title-wrapper', className)}>
      <div className={classnames('title', { 'tac': !childrenComponent })}>
        <h1>{title}</h1>
        <p className="subtitle">
          {subtitle}
        </p>
      </div>
      {childrenComponent && <div className='flex children-component'>{childrenComponent}</div>}
    </div>
  )
}

export default Title;
