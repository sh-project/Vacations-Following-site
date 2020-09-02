import React, { useContext, useState, useEffect } from 'react';
import ErrorMsgContext from '../../context/ErrorMsgContext';
import './ErrorMsg.css';

const ErrorMsg = () => {
    const { errorMsg, setErrorMsg } = useContext(ErrorMsgContext);
    const error = errorMsg ? errorMsg.error : false;
    const msg = errorMsg ? errorMsg.msg : false;
    const [msgClass, setMsgClass] = useState(error? "error-msg" : "error-msg error-msg-success");

    const closeError = () => {
        setMsgClass(error? "error-msg close-error" : "error-msg error-msg-success close-error")
        setTimeout(() => {
            setErrorMsg(false)
        }, 500); //For exit animation
    }

    const msgRender = () =>{
        if (typeof msg === 'object' && msg.length > 1) {
            return <ul>
                {msg.map(single =><li key={single}>{single}</li>)}
            </ul>;
        }
       return msg;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            closeError();
        }, 2500);

        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="error-msg-wrapper">
            <div className={msgClass}>
                <button
                    className="closePopup"
                    onClick={closeError}>
                    X
                </button>
                {msgRender()}
            </div>
        </div>
    );
}

export default ErrorMsg;

