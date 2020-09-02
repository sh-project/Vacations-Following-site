import React from 'react';
import './Error.css';

const Error = (props) => {
    const { error } = props

    if (typeof error === 'object' && error.length > 1) {
        return <ul className="form-error">
            {error.map(single => <li key={single}>{single}</li>)}
        </ul>;
    }

    return (
        <div className="form-error">
            {error}
        </div>
    );
}

export default Error;
