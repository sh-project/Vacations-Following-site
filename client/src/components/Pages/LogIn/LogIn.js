import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './LogIn.css';
import UserContext from '../../../context/UserContext';
import ErrorMsgContext from '../../../context/ErrorMsgContext';
import FormErrors from '../../Forms/FormErrors/FormErrors';
const { checkUsername, checkPassword } = require('../../Forms/validations');

const SignUp = () => {
  const { setUser } = useContext(UserContext);
  const { setErrorMsg } = useContext(ErrorMsgContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(false);

  const validation = () => {
    if (checkUsername(userName) || checkPassword(password)) {
      setErrors('Username or password are invalid');
      return true
    }
  }

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === "userName") return setUserName(value);
    if (name === "password") return setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validation()) return;

    const newUser = {
      username: userName,
      password: password,
    }

    try {
      const res = await fetch(`/user/login`, {
        method: 'POST',
        credentials: 'include',
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
        setUser(msg);
      }
    }
    catch{
      setErrorMsg({ error: true, msg: "Log in failed" });
    }
  }

  return (
    <div className="sign-container">
      <div className="form-container scale-up-center">
        <h1 className="form-title">Log in</h1>
        <form onSubmit={handleSubmit} >
          {errors && <FormErrors errors={errors} />}
          <div className="form-group">
            <input required
              type="text"
              name="userName"
              value={userName}
              onChange={handleChange}
              className="form-control"
              placeholder="user Name" />
          </div>
          <div className="form-group">
            <input required
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              placeholder="password" />
          </div>
          <input
            type="submit"
            value="Log in"
            className="submit" />
        </form>
        <br />
        <hr></hr>
        Don't have a free account yet?<br />
        <Link className="light-button" to="/signup">Create your account</Link>
      </div>
    </div>
  )
}

export default SignUp;