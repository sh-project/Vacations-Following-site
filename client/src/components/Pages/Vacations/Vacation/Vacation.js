import React, { useContext, Fragment, useState } from 'react';
import './Vacation.css'
import Follow from '../Follow/Follow';
import UserContext from '../../../../context/UserContext';
import VacationContext from '../../../../context/VacationContext';

function Vacation(props) {
    const { sendSocket, openPopup, id, destination, slogan, image, description, date_from, date_to, price, followers, userfollow } = props;
    const { user } = useContext(UserContext);
    const { admin } = user;
    const { setVacation } = useContext(VacationContext);
    const [more, setMore] = useState(false);

    const handleClick = (e) => {
        openPopup(e)
        setVacation(props)
    }

    const followOrAdmin = () => {
        if (!admin) {
            return <Follow sendSocket={sendSocket} id={id} destination={destination} userfollow={userfollow} followers={followers} />
        }
        return (
            <Fragment>
                <button className="follow delete-vacation-button"
                    onClick={handleClick} content={"delete"}>
                    Delete
                </button>
                <button className="follow"
                    onClick={handleClick} content={"edit"}>
                    Edit
                </button>
            </Fragment>
        )
    }

    return (
        <div className="vacation scale-up-center">
            {more || <div>
                <div className="vacation-img">
                    <img src={"/uploads/" + image} width="500" alt={image}></img>
                </div>
                <div className="details">
                    <div className="destination">{destination}</div>
                    <div className="date">{date_from} - {date_to}</div>
                    <div className="slogan">{slogan}</div>
                    <div className="row-between">
                        {followers > 0 && <div className="followers">{followers} followers</div>}
                        <div className="price">{price} $</div>
                    </div>
                </div>
            </div>}
            {more && <div className="details description">
                <div className="destination">{destination}</div>
                <div className="slogan">{description}</div>
            </div>}
            <div className="row-between vacation-buttons">
                {followOrAdmin()}
                <button className="more" onClick={() => setMore(!more)}>{!more ? 'More' : 'Less'}</button>
            </div>
        </div>
    );
}

export default Vacation;