const yup = require('yup');
const { setLocale } = require('yup');
const { pt } =require('yup-locales');
require('yup-locales')(yup);

setLocale(pt);

module.exports = yup;