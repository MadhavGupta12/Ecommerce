import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../features/authSlice';
import { useLoginMutation } from '../services/apiSlice';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@luxehaven.dev', password: 'password123' });
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const user = await login(form).unwrap();
    dispatch(setCredentials(user));
    navigate('/');
  };

  return (
    <form className="panel mx-auto max-w-md space-y-4" onSubmit={submit}>
      <h1 className="text-3xl font-bold">Login</h1>
      {error && <p className="text-sm text-red-600">{error.data?.message || 'Login failed'}</p>}
      <input className="input" onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" value={form.email} />
      <input className="input" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" value={form.password} />
      <button className="btn w-full" disabled={isLoading} type="submit">Login</button>
      <p className="text-sm">New here? <Link className="font-semibold text-brass" to="/register">Create account</Link></p>
    </form>
  );
}
