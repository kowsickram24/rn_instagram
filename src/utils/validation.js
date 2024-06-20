import * as yup from 'yup';

export const LoginSchema = yup.object({
  email: yup
    .string()
    .matches(emailRegex, 'Invalid Mail')
    .email('Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RegSchema = yup.object({
  username: yup
    .string()
    .matches(
      /^[a-z0-9_.]+$/,
      'Username must be in lowercase, can include_, .',
    )
    .required('Name is required'),
  email: yup
    .string()
    .matches(emailRegex, 'Invalid Mail')
    .email('Invalid email')
    .required('Email is required'),
  fullname: yup.string().required('Fullname is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Required at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Password is required'),
});
