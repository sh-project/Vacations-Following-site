import React from 'react';
import './popup.css';

const PopupFrame = (props) => {
    const handleClick = (e) => {
        e.stopPropagation();
    }

    return (
        <div className="popup scale-up-center" onClick={handleClick}>
            {props.content}
        </div>
    )
}

const Popup = (props) => {
    const { content, onClick } = props

    return (
        <div className="popup-wrapper" onClick={props.onClick}>
            <PopupFrame content={content} onClick={onClick} />
        </div>
    )
}

export { Popup }