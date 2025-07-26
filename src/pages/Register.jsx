import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { register } from '../features/authentification/authSlice';
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  //const onSubmit = (e) => {
  //  e.preventDefault();
  //  console.log("register", first_name, last_name, role, email, phone, password)
  //  dispatch(register({first_name, last_name, role, email, phone, password}))
  //}

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!first_name || !last_name || !role || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await dispatch(register({ first_name, last_name, role, email, phone, password }))

    if (register.fulfilled.match(result)) {
      navigate('/login'); 
    } else {
      setError(result.payload || 'Registration failed.');
    }
  };

  return (
    <>
      {/* Registration Form */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
          <div className="text-center">
            <UserPlus className="mx-auto h-10 w-10 text-purple-500" />
            <h2 className="mt-4 text-2xl font-bold text-purple-500">Create an Account</h2>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4 text-gray-800">
            <input type="text" name="first_name" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />
            <input type="text" name="last_name" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />
            <select name="role" onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-400" required>
              <option value="">Select Role</option>
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />
            <input type="phone_number" name="phone_number" placeholder="07..." onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" required />

            <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}