//value validations 
const checkIfEmpty = (value, fieldName) => {
    if (value === '') return ` ${fieldName} is a required field.`;
}

const checkLength = (min, max, value, fieldName) => {
    if (value.length < min || value.length > max) {
        return `${fieldName} should be between ${min} and ${max} letters.`;
    }
}
const checkLettersOnly = (value, fieldName) => {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!(Regex.test(value))) return `${fieldName} must contain only letters.`;
}

const checkLettersAndNumbersOnly = (value, fieldName) => {
    const Regex = /^[a-zA-Z0-9]+$/;
    if (!(Regex.test(value))) return `${fieldName} must contain only Letters and Numbers.`;
}

const checkDate = (value, fieldName) => {
    const Regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
    if (!(Regex.test(value))) return `${fieldName} Is not a valid date.`;
}

//fields validations 
const checkUsername = (username) => {
    const IfEmpty = checkIfEmpty(username, 'User Name');
    if (IfEmpty) return IfEmpty;

    const msg = [];
    const fieldLength = checkLength(3, 32, username, 'User Name')
    if (fieldLength) msg.push(fieldLength);

    const LettersAndNumbersOnly = checkLettersAndNumbersOnly(username, 'User Name')
    if (LettersAndNumbersOnly) msg.push(LettersAndNumbersOnly);

    if (msg.length) return msg;
    return false;
}

const checkName = (name, fieldName) => {
    const IfEmpty = checkIfEmpty(name, fieldName);
    if (IfEmpty) return IfEmpty;

    const msg = [];
    const fieldLength = checkLength(3, 35, name, fieldName)
    if (fieldLength) msg.push(fieldLength);

    const LettersOnly = checkLettersOnly(name, fieldName)
    if (LettersOnly) msg.push(LettersOnly);

    if (msg.length) return msg;
    return false;
}

const checkImage = (file) => {
    if (!file) return 'Image required'

    const msg = [];
    if (file.size > 3000000) {
       msg.push('The file is too large.');
    }

    const typeArr = file.type.split('/')[0];
    if (typeArr !== 'image') msg.push('Only images should be selected');

    if (msg.length) return msg;
    return false;
}

const checkPassword = (password) => {
    const IfEmpty = checkIfEmpty(password, 'Password')
    if (IfEmpty) return IfEmpty;

    const PasswordRegex = /^(?=.*\d)(?=.*[a-z]).{4,50}$/;
    if (!(PasswordRegex.test(password))) {
        return 'The password must contain at least 4 characters, at least one letter, and at least one number.'
    }

    return false;
}

const checkConfirmPassword = (confirmPassword, password) => {
    const IfEmpty = checkIfEmpty(confirmPassword, 'confirm Password')
    if (IfEmpty) return IfEmpty;

    if (confirmPassword !== password) {
        return 'The passwords do not match.'
    }

    return false;
}

const checkRequiredDate = (date, fieldName) => {
    const IfEmpty = checkIfEmpty(date, fieldName);
    if (IfEmpty) return IfEmpty;

    const notDate = checkDate(date, fieldName);
    if (notDate) return notDate;

    return false;
}

const checkFreeText = (text, fieldName) => {
    const IfEmpty = checkIfEmpty(text, fieldName);
    if (IfEmpty) return IfEmpty;

    const fieldLength = checkLength(1, 255, text, fieldName);
    if (fieldLength) return fieldLength;

    return false;
}

const checkOptionalFreeText = (text, fieldName) => {
    const fieldLength = checkLength(1, 255, text, fieldName);
    if (fieldLength) return fieldLength;

    return false;
}

const checkNumber = (number, fieldName) => {
    const IfEmpty = checkIfEmpty(number, fieldName);
    if (IfEmpty) return IfEmpty;

    const Regex = /^\d+$/;
    if (!(Regex.test(number))) return 'Not a number';

    return false;
}

module.exports = { checkUsername, checkName, checkImage, checkPassword, checkConfirmPassword, checkRequiredDate, checkFreeText, checkOptionalFreeText, checkNumber };