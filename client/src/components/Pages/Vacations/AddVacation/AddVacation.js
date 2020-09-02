import React, { useRef, useState, useContext } from 'react';
import ErrorMsgContext from '../../../../context/ErrorMsgContext';
import FormErrors from '../../../Forms/FormErrors/FormErrors';
const { checkName, checkNumber, checkImage, checkFreeText, checkOptionalFreeText, checkRequiredDate } = require('../../../Forms/validations');

function AddVacation(props) {
    const { sendSocket, closePopup } = props;
    const [destination, setDestination] = useState('');
    const [slogan, setSlogan] = useState('');
    const [description, setDescription] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [price, setPrice] = useState('');
    const fileInputRef = useRef();
    const [errors, setErrors] = useState(false);
    const { setErrorMsg } = useContext(ErrorMsgContext);

    const validation = (checkempty) => {
        const currenterrors = [];
        if (destination || checkempty) {
            const checkDestination = checkName(destination, 'destination');
            if (checkDestination) currenterrors.push(checkDestination);
        }
        if (slogan || checkempty) {
            const checkSlogan = checkFreeText(slogan, 'slogan');
            if (checkSlogan) currenterrors.push(checkSlogan);
        }
        if (description || checkempty) {
            const checkDescription = checkOptionalFreeText(description, 'description');
            if (checkDescription) currenterrors.push(checkDescription);
        }
        if (dateFrom || checkempty) {
            const checkDateFrom = checkRequiredDate(dateFrom, 'Date From');
            if (checkDateFrom) currenterrors.push(checkDateFrom);
        }
        if (dateTo || checkempty) {
            const checkDateTo = checkRequiredDate(dateTo, 'Date To');
            if (checkDateTo) currenterrors.push(checkDateTo);
        }
        if (price || checkempty) {
            let checPrice = checkNumber(price, 'price')
            if (price > 99999) checPrice = 'Price up to 99,999';
            if (checPrice) currenterrors.push(checPrice);
        }
        //is dateTo agter dateFrom
        if (dateTo && dateFrom) {
            if (dateTo < dateFrom) currenterrors.push('End date, must be after the start date');
        }
        //Check type and size of image
        const files = fileInputRef.current.files;
        if (files[0] || checkempty) {
            const checkImageRes = checkImage(files[0]);
            if (checkImageRes) currenterrors.push(checkImageRes);
        }

        if (currenterrors.length) {
            setErrors(currenterrors);
            return true
        }
        setErrors(false);
    }

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        if (name === "destination") return setDestination(value);
        if (name === "slogan") return setSlogan(value);
        if (name === "description") return setDescription(value);
        if (name === "dateFrom") return setDateFrom(value);
        if (name === "dateTo") return setDateTo(value);
        if (name === "dateTo") return setDateTo(value);
        setPrice(value);
    };

    const handleBlur = () => {
        validation(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validation(true)) return;

        const files = fileInputRef.current.files;
        const formData = new FormData();
        formData.append('destination', destination);
        formData.append('slogan', slogan);
        formData.append('cover', files[0]);
        formData.append('description', description);
        formData.append('date_from', dateFrom);
        formData.append('date_to', dateTo);
        formData.append('price', price);

        try {
            const res = await fetch('/admin/addvacation', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const { success, msg } = await res.json();
            if (!success) {
                setErrorMsg({ error: true, msg: msg });
            } else {
                const { image, id } = msg;
                setErrorMsg({ error: false, msg: `The new vacation was successfully added` });

                const newVacation = {
                    id: id,
                    destination: destination,
                    slogan: slogan,
                    image: image,
                    description: description,
                    date_from: dateFrom,
                    date_to: dateTo,
                    price: price,
                    followers: 0,
                    userfollow: ''
                }
                closePopup();
                sendSocket({
                    vacationUpdate: { update: 'add', id: "", newVacations: newVacation },
                    msg: `${destination}, ​​a new vacation! follow her.`
                });
            }
        }
        catch{
            setErrorMsg({ error: true, msg: 'Failed to add vacation' });
        }
    }

    return (
        <div>
            <div className="form-container">
                <button onClick={closePopup} className="follow">X</button>
                <h1 className="form-title">Add vacation</h1>
                <h4 className="form-subtitle">the way to conquer the world</h4>
                <form onSubmit={handleSubmit} >
                    {errors && <FormErrors errors={errors} />}
                    <div className="form-group">
                        <input required
                            type="text"
                            name="destination"
                            value={destination}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control bold"
                            placeholder="destination" />
                    </div>
                    <div className="form-group">
                        <input required
                            type="text"
                            name="slogan"
                            value={slogan}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="slogan" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">image</label>
                        <input required
                            name="image"
                            ref={fileInputRef}
                            onBlur={handleBlur}
                            type="file"
                            className="form-control file-control" />
                    </div>
                    <div className="form-group">
                        <input
                            type="textarea"
                            name="description"
                            value={description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="description" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">from:</label>
                        <input required
                            type="date"
                            name="dateFrom"
                            value={dateFrom}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="date from" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">to:</label>
                        <input required
                            type="date"
                            name="dateTo"
                            value={dateTo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="date to" />
                    </div>
                    <div className="form-group">
                        <input required
                            type="number"
                            name="price"
                            value={price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="form-control"
                            placeholder="price" />
                    </div>
                    <input
                        type="submit"
                        value="Add vacation"
                        className="submit" />
                </form>
            </div>
        </div>
    );
}

export default AddVacation;
