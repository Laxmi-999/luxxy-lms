'use client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { userRegister } from '../Redux/slices/authSlice';
import {useAppDispatch} from '../Redux/hooks'
// import { registerUser } from '@/Redux/slices/authSlice';
// import { useAppDispatch } from '@/Redux/hooks';


const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

//    role: Yup.string()
//     .oneOf(['reader', 'contributor'], 'Invalid role selected')
//     .required('Role is required'),
});



const Register = () => {

const dispatch = useAppDispatch();


  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4" 
      style={{ backgroundImage: 'url(https://www.voicesofruralindia.org/wp-content/uploads/2020/11/ylswjsy7stw-scaled.jpg)' }}
    >
      
      <div className="absolute w-[95vw] max-w-md bg-opacity-0 rounded-2xl p-8 md:max-w-lg lg:max-w-xl">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600&family=Lato:wght@400;700&display=swap');
        `}</style>
        {/* Register Form */}
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={ async (values, {setSubmitting, resetForm}) => {


            console.log('Submitted values:', values);
            await dispatch(userRegister(values))

            resetForm();
            setSubmitting(false);

            
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="w-[100%] flex flex-col justify-center bg-orange-400 px-[2rem] py-5 rounded-[2rem] shadow-lg"
            >
              {/* Header with Register and Sign In link */}
              <div className="mb-10 text-center">
                <h1 className="text-xl font-semibold text-white font-['Roboto','Open Sans','Lato','sans-serif'] tracking-tight bg-clip-text md:text-5xl">
                  Create Account
                </h1>
                <p className="mt-2 text-white text-sm font-['Roboto','Open Sans','Lato','sans-serif'] font-medium">
                  Already have an account?{' '}
                  <Link href="/Login" className="text-yellow-300 ml-1 hover:text-yellow-100 font-semibold underline italic transition duration-300 ease-in-out">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold text-sm mb-2 tracking-wide">
                   username
                </label>
                <input
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Laxmi Regmi"
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md"
                />
                <div className="h-5 text-sm mt-1  font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.username && touched.username && (
                    <span className="text-red-700">{errors.username}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold text-sm mb-2 tracking-wide">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md"
                />
                <div className="h-5 text-sm mt-1  font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.email && touched.email && (
                    <span className="text-red-700">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold text-sm tracking-wide">
                    Password
                  </label>
                  <Link href="/forgot-password" 
                    className="text-white font-['Roboto','Open Sans','Lato','sans-serif'] text-sm font-semibold hover:text-lime-200 transition duration-300 ease-in-out">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter 6 characters or more"
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-2 border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md"
                />
                <div className="h-5 text-sm mt-1 text-red-600 font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.password && touched.password && (
                    <span className="text-red-700">{errors.password}</span>
                  )}
                </div>
              </div>

               
              {/* <div className="mb-6">
                <label htmlFor="role" className="block text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold text-sm mb-2 tracking-wide">
                  Select Your Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md appearance-none cursor-pointer"
                  style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em'}}
                >
                  <option value="" disabled className="text-gray-400 bg-gray-700">Select your role here</option>
                  <option value="reader" className="text-white bg-gray-700">Reader</option>
                  <option value="contributor" className="text-white bg-gray-700">Contributor</option>
                </select>
                <div className="h-5 text-sm mt-1 font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.role && touched.role && (
                    <span className="text-red-700">{errors.role}</span>
                  )}
                </div>
              </div> */}
              

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex text-black items-center align-center ml-auto mr-auto justify-center w-90 font-['Roboto','Open Sans','Lato','sans-serif'] cursor-pointer bg-yellow-500  hover:text-gray-900 font-semibold text-base px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
              >
                Register
              </button>

              {/* Divider */}
              <div className="w-full text-center my-8 relative">
                <span className="text-gray-500 absolute  font-medium text-sm px-4 bg-gray-200 bg-opacity-50 rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  or continue with
                </span>
                <div className="w-full h-px bg-gray-300"></div>
              </div>

              {/* Google and Facebook Buttons */}
              <div className="w-full flex justify-between gap-4">
                <button className="flex-1 border border-1 border-white hover:bg-gradient-to-r from-[#4285F4] via-[#DB4437] via-[#F4B400] to-[#0F9D58] text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold p-3 rounded-lg hover:from-[#387AE3] hover:via-[#C53D31] hover:via-[#E3A300] hover:to-[#0D8C4D] transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1 active:scale-95">
                  Google
                </button>
                <button className="flex-1 border border-1 border-white text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold p-3 rounded-lg hover:bg-[#1877F2] hover:border-blue-500 transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1 active:scale-95">
                  Facebook
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;