import React, { useContext } from 'react';
import VacationsContext from '../../../../context/VacationsContext';
import UserContext from '../../../../context/UserContext';
import ErrorMsgContext from '../../../../context/ErrorMsgContext';

const Follow = (props) => {
    const { sendSocket, id, destination, userfollow, followers } = props;
    const { vacations } = useContext(VacationsContext);
    const { user } = useContext(UserContext);
    const { setErrorMsg } = useContext(ErrorMsgContext);
    const unfollow = userfollow ? 'unfollow' : 'follow';
    const followString = userfollow ? 'following' : 'follow';

    const updateFollow = async () => {
        try {
            const res = await fetch(`/vacations/${unfollow}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vacation: id })
            });
            const { success, msg } = await res.json();
            if (!success) {
                setErrorMsg({ error: true, msg: msg });
            } else {
                const newVacations = vacations.map(vacation => {
                    if (vacation.id === id) {
                        if (unfollow === 'unfollow') {
                            return { ...vacation, userfollow: '', followers: followers - 1 }
                        }
                        return { ...vacation, userfollow: user.id, followers: followers + 1 }
                    }
                    return vacation;
                });
                setErrorMsg({ error: false, msg: `You ${unfollow} ${destination}` });
                sendSocket({ 
                    vacationUpdate: { update: 'update', id: id, newVacations: newVacations },
                    msg: `The '${destination}' vacation has ${userfollow ? 'one less follower' : 'a new follower'}`
                });
            }
        }
        catch{
            setErrorMsg({ error: true, msg: unfollow + " failed" });
        }
    }

    return (
        <button onClick={updateFollow} className={"follow " + followString}>{followString}</button>
    );
}

export default Follow;
