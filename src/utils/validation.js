import * as yup from 'yup';

export const LoginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RegSchema = yup.object({
  username: yup
    .string()
    .matches(/^[a-z0-9_.]+$/, 'Username must be in lowercase, can include_, .')
    .required('Name is required'),
  email: yup
    .string()
    .matches(emailRegex, 'Invalid email')
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

export const ProfileSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .matches(
      /^[a-z0-9_.]+$/,
      'Username can only contain letters, numbers, and underscores',
    )
    .required('Username is required'),
  fullname: yup.string().required('Full name is required'),
  bio: yup.string().max(150, 'Bio cannot exceed 150 characters'),
});
