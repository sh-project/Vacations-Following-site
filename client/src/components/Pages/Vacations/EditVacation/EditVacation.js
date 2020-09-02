import React, { useRef, useState, useContext } from 'react';
import VacationsContext from '../../../../context/VacationsContext';
import VacationContext from '../../../../context/VacationContext';
import ErrorMsgContext from '../../../../context/ErrorMsgContext';
import FormErrors from '../../../Forms/FormErrors/FormErrors';
const { checkName, checkNumber, checkFreeText, checkImage, checkOptionalFreeText, checkRequiredDate } = require('../../../Forms/validations');

function EditVacation(props) {
    const { closePopup, sendSocket } = props;
    const { vacations } = useContext(VacationsContext);
    const { setErrorMsg } = useContext(ErrorMsgContext); //for error pop-up
    const [errors, setErrors] = useState(false); //for form errors
    const [replaceImage, setReplaceImage] = useState();
    //vacation
    const { vacation } = useContext(VacationContext);
    const { id, image, destination: destinationContext, slogan: sloganContext, description: descriptionContext } = vacation;
    const { date_from: date_fromContext, date_to: date_toContext, price: priceContext } = vacation;
    const dateFormat = (date) => {
        date = date.split("/");
        date = date.reverse();
        date = date.join("-");
        return date;
    }
    //inputs
    const [destination, setDestination] = useState(destinationContext);
    const [slogan, setSlogan] = useState(sloganContext);
    const [description, setDescription] = useState(descriptionContext);
    const [dateFrom, setDateFrom] = useState(dateFormat(date_fromContext));
    const [dateTo, setDateTo] = useState(dateFormat(date_toContext));
    const [price, setPrice] = useState(priceContext);
    const fileInputRef = useRef();

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
        if (replaceImage) {
            const files = fileInputRef.current.files;
            if (files[0] || checkempty) {
                const checkImageRes = checkImage(files[0]);
                if (checkImageRes) currenterrors.push(checkImageRes);
            }
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

    const handleReplaceImage = () => {
        setReplaceImage(!replaceImage);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validation(true)) return;

        const formData = new FormData();
        formData.append('id', id);
        formData.append('destination', destination);
        formData.append('slogan', slogan);
        formData.append('description', description);
        formData.append('date_from', dateFrom);
        formData.append('date_to', dateTo);
        formData.append('price', price);

        if (replaceImage) {
            const files = fileInputRef.current.files;
            formData.append('cover', files[0]);
            formData.append('replaceImage', true);
            formData.append('image', image);
        }
        else {
            formData.append('replaceImage', false);
        }

        try {
            const res = await fetch('/admin/editvacation', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const { success, msg, image: newImage } = await res.json();
            if (!success) {
                setErrorMsg({ error: true, msg: msg });
            } else {
                const newVacations = vacations.map(vaca => {
                    if (vaca.id === id) {
                        return {
                            ...vaca,
                            destination: destination,
                            slogan: slogan,
                            image: replaceImage ? newImage : vaca.image,
                            description: description,
                            date_from: dateFrom,
                            date_to: dateTo,
                            price: price
                        }
                    }
                    return vaca;
                });
                setErrorMsg({ error: false, msg: 'The edit was successful' });
                closePopup();
                sendSocket({
                    vacationUpdate: { update: 'update', id: id, newVacations: newVacations },
                    msg: `The '${destination}' vacation has been updated`
                });
            }
        }
        catch{
            setErrorMsg({ error: false, msg: 'Failed to edit vacation' });
        }
    }

    return (
        <div>
            <div className="form-container">
                <button className="follow" onClick={closePopup}>X</button>
                <h1 className="form-title">Edit Vacation</h1>
                <h4 className="form-subtitle">The followers will be updated in real time</h4>
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
                    <div>
                        <input className="checkbox" id="replaceCheckbox" type="checkbox" checked={replaceImage} onChange={handleReplaceImage}></input>
                        <label htmlFor="replaceCheckbox" className="checkbox-label">Replace the image?</label>
                    </div>
                    {replaceImage && <div className="form-group">
                        <label className="form-label">image</label>
                        <input required
                            name="image"
                            ref={fileInputRef}
                            onBlur={handleBlur}
                            type="file"
                            className="form-control file-control" />
                    </div>}
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
                        value="save Changes"
                        className="submit" />
                </form>
            </div>
        </div>
    );
}

export default EditVacation;

