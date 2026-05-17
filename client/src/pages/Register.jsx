import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import { useRegisterMutation } from '../services/apiSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const user = await register(form).unwrap();
    dispatch(setCredentials(user));
    navigate('/');
  };

  return (
    <form className="panel mx-auto max-w-md space-y-4" onSubmit={submit}>
      <h1 className="text-3xl font-bold">Create account</h1>
      {error && <p className="text-sm text-red-600">{error.data?.message || 'Registration failed'}</p>}
      <input className="input" onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" value={form.name} />
      <input className="input" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" value={form.email} />
      <input className="input" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" value={form.password} />
      <button className="btn w-full" disabled={isLoading} type="submit">Register</button>
    </form>
  );
}
