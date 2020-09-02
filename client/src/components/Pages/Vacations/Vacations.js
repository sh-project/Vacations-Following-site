import React, { useState, useContext, useEffect, useRef } from 'react';
import SocketIo from 'socket.io-client';
import UserContext from '../../../context/UserContext';
import VacationsContext from '../../../context/VacationsContext';
import VacationContext from '../../../context/VacationContext';
import ErrorMsgContext from '../../../context/ErrorMsgContext';
import Vacation from './Vacation/Vacation';
import { Popup } from '../../Popup/Popup';
import AddVacation from '../Vacations/AddVacation/AddVacation';
import EditVacation from '../Vacations/EditVacation/EditVacation';
import DeleteVacation from '../Vacations/DeleteVacation/DeleteVacation';
import SocketAlert from './SocketAlert/SocketAlert';
import Filter from './Filter/Filter';
import './Vacations.css'
const { filtering } = require('./Filter/filtering');

function Vacations() {
    const { user } = useContext(UserContext);
    const { admin } = user;
    const { vacations, setVacations } = useContext(VacationsContext);
    const { setErrorMsg } = useContext(ErrorMsgContext);
    const [vacation, setVacation] = useState(''); // Vacation Context to edit or delete Vacation
    const [showPopup, setShowPopup] = useState({ show: false, content: "" });
    //socket state
    const socket = useRef();
    const [socketAlert, setSocketAlert] = useState(false);
    //filters state
    const [filter, setFilter] = useState(false);
    const [sortBy, setSortBy] = useState('userfollow');

    const getVacations = async () => {
        try {
            const res = await fetch('/vacations', {
                credentials: 'include'
            });
            const { success, msg } = await res.json();
            if (!success) {
                setErrorMsg({ error: true, msg: msg });
            }
            else {
                setVacations(msg);
            }
        } catch {
            setErrorMsg({ error: true, msg: 'There may be problems connecting. We\'re fixing it.' });
        }
    }

    useEffect(() => {
        getVacations();

        socket.current = SocketIo();

        return () => {
            socket.current.disconnect();
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        socket.current.off('toClient')
        socket.current.on('toClient', (data) => {
            const { user: userId, data: newData } = data;
            setSocketData(newData, vacations, userId)
        });
        // eslint-disable-next-line
    }, [vacations]);

    const sendSocket = (data) => {
        socket.current.emit('fromClient', { user: user.id, data: data });
    };

    const setSocketData = (data, prevdata, userId) => {
        // updated / deleted vacation - pop up Only if the user follow the vacation.
        // Adding a new vacation - pops up for all users.
        // All updates are updated, without notice, for all users.
        // not pop-up for the user who updated.
        let newVacations = [];
        const { vacationUpdate, msg } = data;
        const { update, id: receivedId, newVacations: receivedVacations } = vacationUpdate;

        if (update === 'add') {
            setVacations([receivedVacations, ...vacations]);
            if (userId !== user.id) { setSocketAlert(msg); }
        } else {
            //pop-up if follow the vacation
            newVacations = [...vacations];
            if (newVacations.find(newVacation => newVacation.id === receivedId && newVacation.userfollow)) {
                if (userId !== user.id) { setSocketAlert(msg); }
            }
            //update
            if (update === 'update') {
                //update this user vacations following.
                if (userId === user.id) {
                    return setVacations(receivedVacations);
                }
                newVacations = receivedVacations.map(receVacation => {
                    const prevVacation = vacations.find(prevVacation => receVacation.id === prevVacation.id);
                    return { ...receVacation, userfollow: prevVacation.userfollow };
                })
            } else { //remove vacation
                newVacations = vacations.filter(vacation => {
                    return vacation.id !== receivedId;
                });
            }
            setVacations(newVacations);
        }
    }

    const closeSocketAlert = () => {
        setSocketAlert(false);
    }

    const closePopup = (e) => {
        setShowPopup({ show: false, content: "" });
        setVacation({});
    }

    const openPopup = (e) => {
        let content = e.target.getAttribute('content');
        if (content === "add") {
            content = <AddVacation closePopup={closePopup} sendSocket={sendSocket} />;
        }
        else if (content === "edit") {
            content = <EditVacation closePopup={closePopup} sendSocket={sendSocket} />;
        }
        else if (content === "delete") {
            content = <DeleteVacation closePopup={closePopup} sendSocket={sendSocket} />;
        }
        else {
            content = "";
        }
        setShowPopup({ show: true, content: content });
    }

    //filter and render vacations
    const filters = () => {
        return <Filter
            filter={filter}
            setFilter={(e) => setFilter(!filter)}
            sortBy={sortBy}
            setSortBy={(e) => setSortBy(e.target.value)}
        />
    }

    const renderVacations = () => {
        if (vacations) {
            return filtering(filter, sortBy, vacations).map(vacation =>
                <Vacation
                    sendSocket={sendSocket}
                    openPopup={openPopup}
                    key={vacation.id}
                    {...vacation} />);
        } else {
            return <div className="load-vacation">
                <h2>The vacations on vacation :)</h2>
            </div>
        }
    }

    return (
        <div>
            <VacationContext.Provider value={{ vacation, setVacation }}>
                {socketAlert && <SocketAlert
                    msg={socketAlert}
                    onClick={closeSocketAlert}>
                </SocketAlert>}
                <div className="vacations-container">
                    <div className="vacations-header">
                        <h1 className="vacations-h1 tracking-in-expand">Follow your travel</h1>
                    </div>
                </div>
                {filters()}
                <div className="add-wrapper">
                    {admin && <button content={"add"} className={"add-button"} onClick={openPopup}>+</button>}
                </div>
                <div className="vacations">
                    {renderVacations()}
                </div>

                {showPopup.show && <Popup
                    content={showPopup.content}
                    onClick={closePopup}>
                </Popup>}
            </VacationContext.Provider>
        </div>
    );
}

export default Vacations;