import React from 'react';
import './FormErrors.css';
import Error from '../Error/Error';

const FormErrors = (props) => {
  const { errors } = props;

  const renderErrors = () => {
    if (typeof errors === 'object' && errors.length > 1) { //Make sure the length is an array and not a string
      return errors.map(error => <Error key={error} error={error} />);
    }
    return <Error key={errors} error={errors} />
  }

  return (
    <div className="form-errors">
      {renderErrors()}
    </div>
  )
}

export default FormErrors;
