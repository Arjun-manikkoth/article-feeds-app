const phoneRegex = /^(?:\+91[-\s]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (input: string) => emailRegex.test(input);
const isPhone = (input: string) => phoneRegex.test(input);

const validateLoginId = (input: any) => {
    return isEmail(input) || isPhone(input);
};

export { validateLoginId, isEmail, isPhone };
