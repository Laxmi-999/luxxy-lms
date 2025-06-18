// pages/Login/page.tsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, userLogin } from '@/Redux/slices/authSlice';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();


  const {userInfo, status, error, isError, isSuccess} = useSelector((state) => state.auth)

  console.log('userInfo is', userInfo);
  

  useEffect(() => {
    
   if(status === 'succeeded' && userInfo){
     toast.success(userInfo.message || 'Login Successfully', {
      position:'top-center'
     });
    if(userInfo.role === 'admin'){
        router.push('/admin-dashboard');
    }else if(userInfo.role  === 'librarian' ){
        router.push('/librarian-dashboard')
    }else if(userInfo.role === 'member'){
        router.push('/member-dashboard')
    }
      dispatch(clearAuthError());
   }else if(status === 'falied' || isError){
    toast.error(error, {
      position:'top-center'
    });
   }

  },[status, userInfo, router])
  

//   const handleLoginSubmit = async (values: LoginFormValues) => {
    
//     try {

//     //   await dispatch(loginUser({ email: values.email, password: values.password })).unwrap();
//       // On success, the useEffect will handle redirection
//     } catch (err: any) {
//       console.error('Login failed in component:', err);
//       // The `error` state from Redux will automatically update
//     }
//   };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: 'url(https://www.voicesofruralindia.org/wp-content/uploads/2020/11/ylswjsy7stw-scaled.jpg)' }}
    >
      <div className="absolute w-[95vw] max-w-md bg-opacity-0 rounded-2xl p-8 md:max-w-lg lg:max-w-xl">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            console.log('loggedIn values submitted', values);
            await dispatch(userLogin(values));
            toast(userInfo.message)
            setSubmitting(false);
            // Link('/DashBoard')
            
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
              <div className="mb-10 text-center">
                <h1 className="text-xl font-semibold text-white font-['Roboto','Open Sans','Lato','sans-serif'] tracking-tight bg-clip-text md:text-5xl">
                  Login
                </h1>
                <p className="mt-2 text-white text-sm font-['Roboto','Open Sans','Lato','sans-serif'] font-medium">
                  Doesn't have an account?
                  <Link href="/Register" className="text-yellow-300 ml-1 hover:text-yellow-100 font-semibold underline italic transition duration-300 ease-in-out">
                    Sign Up
                  </Link>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-200 font-['Inter'] font-semibold text-sm mb-2 tracking-wide">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md"
                  placeholder="you@example.com"
                />
                <div className="h-5 text-sm mt-1 font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.email && touched.email && (
                    <span className="text-red-800">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-200 font-['Inter'] font-semibold text-sm tracking-wide">Password</label>
                  <Link href="/forgot-password" className="text-blue-white font-['Inter'] text-sm font-semibold hover:text-blue-300 transition duration-300 ease-in-out">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full font-['Roboto','Open Sans','Lato','sans-serif'] bg-opacity-0 border border-white text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition duration-300 ease-in-out placeholder-gray-200 shadow-inner hover:shadow-md"
                  placeholder="Enter your password"
                />
                <div className="h-5 text-sm mt-1 font-['Roboto','Open Sans','Lato','sans-serif']">
                  {errors.password && touched.password && (
                    <span className="text-red-800">{errors.password}</span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3 h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-100 rounded transition duration-300 ease-in-out bg-opacity-0"
                  />
                  <span className="text-gray-200 cursor-pointer font-['Inter'] font-medium text-sm">Remember me</span>
                </label>
              </div>

              {/* {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>} */}

              <button
                type="submit"
                className="inline-flex items-center py-5 align-center ml-auto mr-auto justify-center w-90 font-['Roboto','Open Sans','Lato','sans-serif'] cursor-pointer bg-yellow-500 text-black hover:text-gray-900 font-semibold text-base px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                // disabled={loading}
              >
                {/* {loading ? 'Logging In...' : 'Login'} */}
                Login
              </button>

              <div className="w-full text-center my-8 relative">
                <span className="text-gray-500 absolute font-['Roboto','Open Sans','Lato','sans-serif'] font-medium text-sm px-4 bg-gray-200 bg-opacity-50 rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  or continue with</span>
                <div className="w-full h-px bg-gray-300"></div>
              </div>

              <div className="w-full flex justify-between gap-4">
                <button type="button" className="flex-1 border border-1 cursor-pointer border-white hover:bg-gradient-to-r from-[#4285F4] via-[#DB4437] via-[#F4B400] to-[#0F9D58] text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold p-3 rounded-lg hover:from-[#387AE3] hover:via-[#C53D31] hover:via-[#E3A300] hover:to-[#0D8C4D] transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1 active:scale-95">
                  Google
                </button>
                <button type="button" className="flex-1 border border-1 cursor-pointer border-white text-white font-['Roboto','Open Sans','Lato','sans-serif'] font-semibold p-3 rounded-lg hover:bg-[#1877F2] hover:border-blue-500 transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center transform hover:-translate-y-1 active:scale-95">
                  Facebook
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;