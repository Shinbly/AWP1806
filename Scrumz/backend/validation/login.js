const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
	let errors = {};

	//Convert empty fields to an empty string so we can use validator fucntions
	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";

	//email checks
	if(Validator.isEmpty(data.email)) {
		errors.email = "Email field is require";
	}else if (!Validator.isEmail(data.email)) {
		errors.email = "Email is invalid";
	}

	//Password checks
	if (Validator.isEmpty(data.password)) {
		erros.password = "Password field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};