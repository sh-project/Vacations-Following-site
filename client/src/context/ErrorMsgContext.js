import React from 'react';

const ErrorMsgContext = React.createContext({
    errorMsg: '',
    setErrorMsg: () => { }
})

export default ErrorMsgContext