import React, { useState } from 'react'
import { useForm }         from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate }     from 'react-router-dom'
import { toast }           from 'react-hot-toast'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const {login} = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
      try{
       const user = await login(data);
       if(user) navigate('/tasks');
      }catch (error){
        console.log({ error })
      }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-8">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-24">
              <img src="/images/Logo.svg" alt="Logo wibiTask"/>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">Login</h1>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username', { required: 'username is required' })}
                className={ `w-full px-4 py-4 bg-[#F5F7F9]  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.username && 'border-red-500'}` }
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-l ml-1 mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full px-4 py-4 bg-[#F5F7F9]  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${errors.username && 'border-red-500'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-[50%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-l ml-1 mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-[15px] rounded-xl
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}