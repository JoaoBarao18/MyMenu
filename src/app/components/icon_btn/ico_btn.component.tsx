import './ico_btn.css';

const IconBtn = (props: any) => {
    return (
        <button className={props.btnStyle} onClick={props.onClick}>
            <div className={props.iconStyle}>
                {props.icon}
            </div>
            <span className={props.textStyle}>
                {props.label}
            </span>
        </button>
    );
}


export default IconBtn;