"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPhone = exports.isEmail = exports.validateLoginId = void 0;
const phoneRegex = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = (input) => emailRegex.test(input);
exports.isEmail = isEmail;
const isPhone = (input) => phoneRegex.test(input);
exports.isPhone = isPhone;
const validateLoginId = (input) => {
    return isEmail(input) || isPhone(input);
};
exports.validateLoginId = validateLoginId;
