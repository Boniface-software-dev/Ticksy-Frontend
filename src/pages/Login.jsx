import React from 'react';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authentification/authSlice'
 
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    dispatch(login({ email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        const user = action.payload;

        if (user.token) {
          localStorage.setItem('accessToken', user.token);
        }

        if (user.role === 'attendee') {
          navigate('/events');
        } else {
          navigate(`/${user.role}/${user.id}/profile`);
        }
      } else {
        setError('Invalid email or password.');
      }
    })
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-lg p-8 space-y-6">
        <div className="text-center">
          <LogIn className="mx-auto h-10 w-10 text-purple-500" />
          <h2 className="mt-4 text-2xl font-bold text-purple-500">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-500">Login</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 text-black">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-600 focus:border-green-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-green-800 transition duration-300 shadow"
          >
            Log In
          </button>
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-green-700 font-medium hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

