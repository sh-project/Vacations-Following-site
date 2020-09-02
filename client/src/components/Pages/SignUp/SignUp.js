import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import ErrorMsgContext from '../../../context/ErrorMsgContext';
import FormErrors from '../../Forms/FormErrors/FormErrors';
import './SignUp.css';
const { checkUsername, checkName, checkPassword, checkConfirmPassword } = require('../../Forms/validations');

const SignUp = () => {
  const { setErrorMsg } = useContext(ErrorMsgContext);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(false);
  const [successRegister, setSuccessRegister] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const validation = (checkempty) => {
    //When filling out the form, check only full fields.
    //In order not to warn in vain about fields that have not yet been filled.
    //But before submitting the form, also check empty fields.

    const currenterrors = [];
    if (userName || checkempty) {
      const checkUsernameRes = checkUsername(userName);
      if (checkUsernameRes) currenterrors.push(checkUsernameRes);
    }
    if (firstName || checkempty) {
      const checkFirstNameRes = checkName(firstName, 'First Name');
      if (checkFirstNameRes) currenterrors.push(checkFirstNameRes);
    }
    if (lastName || checkempty) {
      const checkLastNameRes = checkName(lastName, 'Last Name');
      if (checkLastNameRes) currenterrors.push(checkLastNameRes);
    }
    if (password || checkempty) {
      const checkPasswordRes = checkPassword(password);
      if (checkPasswordRes) currenterrors.push(checkPasswordRes);
    }
    if (confirmPassword || checkempty) {
      const checkConfirmPasswordRes = checkConfirmPassword(confirmPassword, password);
      if (checkConfirmPasswordRes) currenterrors.push(checkConfirmPasswordRes);
    }

    if (currenterrors.length) {
      setErrors(currenterrors);
      return true
    }
    setErrors(false);
  }

  const checUsernameExists = async (value) => {
    try {
      const res = await fetch(`/user/checkusername/${value}`, {
        method: 'GET',
        credentials: 'include'
      });
      const { success } = await res.json();
      setUsernameExists(success ? 'Exist' : 'Ok');
    }
    catch{
      setErrorMsg({ error: true, msg: "check if a username already exists - failed" });
    }
  }

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === "userName") {
      if (value) {
        setUserName(value);
        const checkUsernameRes = checkUsername(value);
        if (checkUsernameRes) return setErrors(checkUsernameRes);
        setErrors(false)
        return checUsernameExists(value);
      }
      setUsernameExists(false);
      return setUserName(value);
    }
    if (name === "firstName") return setFirstName(value);
    if (name === "lastName") return setLastName(value);
    if (name === "password") return setPassword(value);
    setConfirmPassword(value);
  };

  const handleBlur = () => {
    validation(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validation(true)) return;

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      username: userName,
      password: password,
    }

    try {
      const res = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const { success, msg } = await res.json();
      if (!success) {
        setErrorMsg({ error: true, msg: msg });
      } else {
        setErrorMsg(false);
        setSuccessRegister(true);
      }
    }
    catch{
      setErrorMsg({ error: true, msg: "Registration failed" });
    }
  }

  if (successRegister) {
    return <Redirect to="/login" push={true} />
  }

  return (
    <div className="sign-container">
      <div className="form-container scale-up-center">
        <h1 className="form-title">Sign up</h1>
        <h4 className="form-subtitle">Come on, it's easy and it's fun</h4>
        <form onSubmit={handleSubmit} >
          {errors && <FormErrors errors={errors} />}
          <div className="form-group">
            <input required
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              placeholder="user Name" />
              {usernameExists && <label className={`form-label ${usernameExists}`}>{usernameExists}</label>}
          </div>
          <div className="form-group">
            <input required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              placeholder="first Name" />
          </div>
          <div className="form-group">
            <input required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              placeholder="Last Name" />
          </div>
          <div className="form-group">
            <input required
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              placeholder="password" />
          </div>
          <div className="form-group">
            <input required
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              placeholder="confirm Password" />
          </div>
          <input
            type="submit"
            value="sign up"
            className="submit" />
        </form>
      </div>
    </div>
  )
}

export default SignUp;
