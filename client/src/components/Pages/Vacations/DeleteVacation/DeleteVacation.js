import React, { useState, useContext } from 'react';
import VacationContext from '../../../../context/VacationContext';
import ErrorMsgContext from '../../../../context/ErrorMsgContext';

const DeleteVacation = (props) => {
    const { closePopup, sendSocket } = props;
    const { setErrorMsg } = useContext(ErrorMsgContext);
    const { vacation } = useContext(VacationContext);
    const { id, destination, image, followers } = vacation;
    const [deleteImage, setDeleteImage] = useState(true);

    const handleDeleteImage = () => {
        setDeleteImage(!deleteImage);
    }

    const remove = async () => {
        try {
            const res = await fetch(`/admin/deletevacation`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vacation: id, image: image, unlinkImage: deleteImage })
            });
            const { success, msg } = await res.json();
            if (!success) {
                setErrorMsg({ error: true, msg: msg });
            } else {
                setErrorMsg({ error: false, msg: msg });
                closePopup();
                sendSocket({
                    vacationUpdate: { update: 'delete', id: id, newVacations: "" },
                    msg: `The ${destination} vacation you are following has been deleted!`
                });
            }
        }
        catch{
            setErrorMsg({ error: true, msg: 'delete vacation failed' });
        }
    }
    return (
        <div>
            <div className="form-container">
                <h2 className="form-title red">delete vacation: {destination}</h2>
                <h4 className="form-subtitle">{followers > 0 ? `There are ${followers} followers of this vacation. ` : ''} Are you sure?</h4>
                <div>
                    <input className="checkbox" id="deleteImage" type="checkbox" checked={deleteImage} onChange={handleDeleteImage}></input>
                    <label htmlFor="deleteImage" className="checkbox-label">Delete also the image From the gallery</label>
                </div>
                <div className="row-around padding-top-1">
                    <button onClick={closePopup} className="follow">Close</button>
                    <button className="follow delete-vacation-button"
                        onClick={remove}>
                        Delete Vacation
                </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteVacation;
