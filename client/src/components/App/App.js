import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import '../Forms/Forms.css'
import UserContext from '../../context/UserContext';
import VacationsContext from '../../context/VacationsContext';
import ErrorMsgContext from '../../context/ErrorMsgContext';
import Header from '../layout/Header/Header';
import Footer from '../layout/Footer/Footer';
import HomePage from '../Pages/HomePage/HomePage';
import SignUp from '../Pages/SignUp/SignUp';
import LogIn from '../Pages/LogIn/LogIn';
import Vacations from '../Pages/Vacations/Vacations';
import Charts from '../Pages/Charts/Charts';
import ErrorMsg from '../ErrorMsg/ErrorMsg';

const App = () => {
  const [user, setUser] = useState('');
  const { admin } = user;
  const [vacations, setVacations] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAuth = async () => {
    try {
      const res = await fetch('/user/isAuth', {
        credentials: 'include'
      });
      const { success, msg: user } = await res.json();
      if (!success) {
        setUser('');
      }
      else {
        setUser(user);
      }
    } catch {
      setErrorMsg({ error: true, msg: 'There may be problems connecting. We\'re fixing it.' });
    }
  }

  useEffect(() => {
    isAuth();
  }, [])

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <VacationsContext.Provider value={{ vacations, setVacations }}>
          <ErrorMsgContext.Provider value={{ errorMsg, setErrorMsg }}>
            {errorMsg && <ErrorMsg />}
            <Router>
              <Header></Header>
              <Switch>
                <Route path="/LogIn">
                  {user && <Redirect to="/vacations" push={true} />}
                  <LogIn />
                </Route>
                <Route path="/SignUp">
                  {user && <Redirect to="/vacations" push={true} />}
                  <SignUp />
                </Route>
                <Route path="/vacations">
                  {!user && <Redirect to="/" push={true} />}
                  <Vacations />
                </Route>
                <Route path="/charts">
                  {!admin && <Redirect to="/" push={true} />}
                  <Charts />
                </Route>
                <Route path="/">
                  {user && <Redirect to="/vacations" push={true} />}
                  <HomePage />
                </Route>
              </Switch>
            </Router>
            <Footer></Footer>
          </ErrorMsgContext.Provider>
        </VacationsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;