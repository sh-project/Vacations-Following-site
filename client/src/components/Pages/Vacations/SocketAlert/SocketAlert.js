import React, { useEffect } from 'react';
import './SocketAlert.css';

const SocketAlaert = (props) => {
    const { msg, onClick: closeSocketAlert } = props;

    useEffect(() => {
        const timer = setTimeout(() => {
            closeSocketAlert();
        }, 2500);

        return () => {
            clearTimeout(timer)
        }
    }, [closeSocketAlert])

    return (
        <div className="socket-alert-wrapper">
            <div className="socket-alert">
                <button
                    className="closePopup"
                    onClick={closeSocketAlert}>
                    X
                </button>
                {msg}
            </div>
        </div>
    );
}

export default SocketAlaert;

