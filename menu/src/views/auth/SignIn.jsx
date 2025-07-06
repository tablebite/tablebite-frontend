// src/views/auth/SignIn.jsx
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth }            from '../../contexts/AuthContext';
import InputField             from 'components/fields/InputField';
import Checkbox               from 'components/checkbox';
import { FcGoogle }           from 'react-icons/fc';

export default function SignIn() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { login }                     = useAuth();
  const location                      = useLocation();
  const fromPath                      = location.state?.from?.pathname || '/admin/default';

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('[SignIn] submitting with:', { email, password, keepLoggedIn });
    try {
      await login({ email, password }, fromPath);
    } catch (err) {
      console.error('[SignIn] login error:', err);
      alert(err.message || 'Sign in failed');
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full  flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600 dark:text-white">
          Enter your email and password to sign in!
        </p>

        {/* Google sign-in stub */}
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <FcGoogle className="rounded-full text-xl" />
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>

        {/* OR divider */}
        <div className="mb-6 flex items-center gap-3 w-full">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">or</p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* EMAIL / PASSWORD FORM */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            value={email}                     // ← controlled
            onChange={e => setEmail(e.target.value)}  // ← controlled
          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            id="password"
            type="password"
            placeholder="admin"
            value={password}                  // ← controlled
            onChange={e => setPassword(e.target.value)} // ← controlled
          />

          {/* Keep me logged in + Forgot */}
          <div className="mb-4 flex w-full items-center justify-between px-2">
            <label className="flex items-center">
              <Checkbox
                checked={keepLoggedIn}
                onChange={e => setKeepLoggedIn(e.target.checked)}
              />
              <span className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </span>
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Sign In
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link
            to="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
