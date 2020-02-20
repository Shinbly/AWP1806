const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateTaskInput(data) {
    let errors = {};

    //Convert empty fields to an empty string so we can use validator fuctions
    data.name = !isEmpty(data.name) ? data.name : "";

    //name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "name field is required";
    }

    console.log(errors);

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
