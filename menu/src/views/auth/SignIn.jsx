import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { FcGoogle } from "react-icons/fc";
import '../../index.css'; 

export default function SignIn() {
  // On mount, apply saved theme
  useEffect(() => {
    const dark = localStorage.getItem("darkmode") === "true";
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading
  const [errors, setErrors] = useState({ username: "", password: "" }); // State to track errors
  const { login } = useAuth();
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || "/admin/default";

  const validate = () => {
    const newErrors = { username: "", password: "" };
    if (!username) newErrors.username = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation before submitting the form
    if (!validate()) {
      return;
    }

    console.log("[SignIn] submitting with:", { username, password, keepLoggedIn });

    setLoading(true); // Start loading when submitting the form
    try {
      await login({ username, password }, fromPath);
    } catch (err) {
      console.error("[SignIn] login error:", err);
      alert(err.message || "Sign in failed");
    } finally {
      setLoading(false); // Stop loading after login attempt
    }
  };

  // Handle input changes and clear error when typing
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) setErrors((prev) => ({ ...prev, username: "" })); // Clear error on input change
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" })); // Clear error on input change
  };

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[5vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
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
          <div className={`mb-3 ${errors.username ? "mb-6" : ""}`}>
            <InputField
              variant="auth"
              label={<><span>Email</span><span className="text-red-500">*</span></>}
              id="email"
              type="email"
              placeholder="Enter email"
              value={username}
              onChange={handleUsernameChange}
            />
            {errors.username && <span className="text-red-500 text-sm mt-1">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className={`mb-3 ${errors.password ? "mb-6" : ""}`}>
            <InputField
              variant="auth"
              label={<><span>Password</span><span className="text-red-500">*</span></>}
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
          </div>

          {/* Keep me logged in + Forgot */}
          <div className="mb-4 flex w-full items-center justify-between px-2">
            <label className="flex items-center">
              <Checkbox
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
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
            className={`linear mt-2 w-full rounded-xl bg-brand-500 h-[48px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 relative flex items-center justify-center ${errors.username || errors.password ? "mt-6" : ""}`}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="loader"></span> // Display loader when loading
            ) : (
              "Sign In"
            )}
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
