import React, { useContext, useState } from 'react';
import './Header.css';
import { NavLink, Link } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import VacationsContext from '../../../context/VacationsContext';
import ErrorMsgContext from '../../../context/ErrorMsgContext';

const Logo = () => {
    return (
        <Link to="/" className="logo">
            <img src="/images/logos/logo.png" alt="logo"></img>
        </Link>
    )
}

const Nav = () => {
    const { user, setUser } = useContext(UserContext);
    const { setVacations } = useContext(VacationsContext);
    const { setErrorMsg } = useContext(ErrorMsgContext);
    const [out, setOut] = useState('Log out');

    const logOut = async () => {
        setOut('Going out')
        try {
            const res = await fetch('/user/logout', {
                method: 'POST',
                credentials: 'include'
            });
            const { success, msg } = await res.json();
            if (success) {
                setTimeout(() => {
                    setUser('');
                    setVacations('');
                    setOut('Log out')
                    setErrorMsg(false);
                }, 500);
            } else {
                setErrorMsg({ error: true, msg: msg });
            }
        } catch {
            setErrorMsg({ error: true, msg: "Log out failed!" });
        }
    }

    if (user) {
        if (!user.admin) {
            return (
                <div className="nav">
                    <ul>
                        <li>
                            <a href="/" onClick={logOut}>{out}</a>
                            {/* "a" And not "Link", in order to refresh the page */}
                        </li>
                        <li>
                            <span className='user-li'>Hello {user.first_name}</span>
                        </li>
                    </ul>
                </div>
            )
        }
        return (
            <div className="nav">
                <ul>
                    <li>
                        <NavLink to="/vacations" activeClassName="active-menu">Vacations</NavLink>
                    </li>
                    <li>
                        <NavLink to="/charts" activeClassName="active-menu">Charts</NavLink>
                    </li>
                    <li>
                        <a href="/" onClick={logOut}>{out}</a>
                        {/* "a" And not "Link", in order to refresh the page */}
                    </li>
                    <li>
                        <span className='user-li'>Hello {user.first_name}</span>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <div className="nav">
            <ul>
                <li>
                    <NavLink  to="/LogIn" activeClassName="active-menu">Log in</NavLink >
                </li>
                <li>
                    <NavLink to="/SignUp" activeClassName="active-menu">Sign up</NavLink>
                </li>
            </ul>
        </div>
    )
}

const Header = () => {
    return (
        <header>
            <div className="header">
                <Logo />
                <Nav />
            </div>
        </header>
    )
}

export default Header;
