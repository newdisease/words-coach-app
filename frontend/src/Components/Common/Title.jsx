import classnames from "classnames";
import "./Title.scss";

const Title = ({
  className,
  title = "Learning words",
  subtitle = (
    <>
      🇬🇧&nbsp;&nbsp;English <span>/</span> Ukrainian&nbsp;&nbsp;🇺🇦
    </>
  ),
  childrenComponent,
}) => {
  return (
    <div className={classnames("flex flex-j-b title-wrapper", className)}>
      <div className={classnames("title", { tac: !childrenComponent })}>
        <p className="text-title">{title} </p>
        <p className="text-subtitle">{subtitle}</p>
      </div>
      {childrenComponent && (
        <div className="flex children-component">{childrenComponent}</div>
      )}
    </div>
  );
};

export default Title;
