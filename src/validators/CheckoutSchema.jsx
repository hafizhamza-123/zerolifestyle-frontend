import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email')
    .required('Email is required'),
  firstName: yup.string()
    .required('Enter a first name'),
  lastName: yup.string()
    .required('Enter a last name'),
  address: yup.string()
    .required('Enter an address'),
  city: yup.string()
    .required('Enter a city'),
  phone: yup.string()
    .required('Enter a phone number')
    .matches(/^[0-9]+$/, "Must be only digits")
    .max(11, "Phone number cannot exceed 11 digits"),
});




