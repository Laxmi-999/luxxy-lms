'use client'; // This component needs to be a client component in Next.js

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; 
import { addLibrarian } from '@/app/Redux/slices/adminSlice';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';

const AddUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});


const AddUserForm = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: AddUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        await dispatch(addLibrarian(values)).unwrap();
        toast.success(successMessage || 'Librarian added successfully!'); 
        resetForm(); 
        onClose(); 
      } catch (err) {
        toast.error(error || 'Failed to add librarian.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
      {/* Name Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name" 
          value={formik.values.name}
          onChange={formik.handleChange} 
          onBlur={formik.handleBlur}     
          className="col-span-3 rounded-md"
        />
      </div>
      {/* Display name validation error */}
      {formik.touched.name && formik.errors.name ? (
        <div className="text-right text-red-500 text-sm col-start-2 col-span-3">{formik.errors.name}</div>
      ) : null}

      {/* Email Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="col-span-3 rounded-md"
        />
      </div>
      {/* Display email validation error */}
      {formik.touched.email && formik.errors.email ? (
        <div className="text-right text-red-500 text-sm col-start-2 col-span-3">{formik.errors.email}</div>
      ) : null}

      {/* Password Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="col-span-3 rounded-md"
        />
      </div>
      {/* Display password validation error */}
      {formik.touched.password && formik.errors.password ? (
        <div className="text-right text-red-500 text-sm col-start-2 col-span-3">{formik.errors.password}</div>
      ) : null}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full mt-4 rounded-md"
        // Disable button while form is submitting or Redux action is loading
        disabled={formik.isSubmitting || loading}
      >
        {formik.isSubmitting || loading ? 'Adding...' : 'Add Librarian'}
      </Button>
    </form>
  );
};

export default AddUserForm;
