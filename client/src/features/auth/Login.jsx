import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import './Login.scss';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const res = await newRequest.post('/auth/login', { email, password });
			localStorage.setItem('currentUser', JSON.stringify(res.data));
			navigate('/');
		} catch (err) {
			setError(err.response.data);
		}
	};

	return (
		<div className="login">
			<form onSubmit={handleSubmit}>
				<h1>Sign in</h1>
				<label htmlFor="email">Email</label>
				<input
					name="email"
					id="email"
					type="text"
					onChange={e => setEmail(e.target.value)}
				/>

				<label htmlFor="password">Password</label>
				<input
					name="password"
					type="password"
					onChange={e => setPassword(e.target.value)}
					id="password"
				/>
				<button type="submit">Login</button>
				{error && <div style={{ textAlign: 'center' }}>{error}</div>}
			</form>
		</div>
	);
}

export default Login;
