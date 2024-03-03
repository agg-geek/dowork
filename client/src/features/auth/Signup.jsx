import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import upload from '../../utils/upload';
import newRequest from '../../utils/newRequest';
import './Signup.scss';

function Signup() {
	const [user, setUser] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		img: '',
		country: '',
		isSeller: false,
		desc: '',
	});

	const [file, setFile] = useState(null);
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleChange = e => {
		setUser(prev => {
			return { ...prev, [e.target.name]: e.target.value };
		});
	};

	const handleSeller = e => {
		setUser(prev => {
			return { ...prev, isSeller: e.target.checked };
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();

		let url = undefined;
		if (file) url = await upload(file);

		try {
			const res = await newRequest.post('/auth/signup', {
				...user,
				...(url && { img: url }),
			});

			localStorage.setItem('currentUser', JSON.stringify(res.data));
			navigate('/');
		} catch (err) {
			console.log(err);
			setError(err.response.data);
		}
	};

	return (
		<>
			<div className="signup">
				<form onSubmit={handleSubmit}>
					<div className="left">
						<h1>Create a new account</h1>
						<label htmlFor="name">Name</label>
						<input
							name="name"
							id="name"
							type="text"
							onChange={handleChange}
						/>
						<label htmlFor="username">Username</label>
						<input
							name="username"
							id="username"
							type="text"
							onChange={handleChange}
						/>
						<label htmlFor="email">Email</label>
						<input
							name="email"
							id="email"
							type="email"
							onChange={handleChange}
						/>
						<label htmlFor="password">Password</label>
						<input
							name="password"
							id="password"
							type="password"
							onChange={handleChange}
						/>
						<label htmlFor="profile">Profile Picture</label>
						<input
							type="file"
							id="profile"
							onChange={e => setFile(e.target.files[0])}
						/>
						{error && <div style={{ textAlign: 'center' }}>{error}</div>}
						<button type="submit">Signup</button>
					</div>

					<div className="right">
						<h1>Become a seller</h1>
						<div className="toggle">
							<label htmlFor="seller">Activate the seller account</label>
							<label className="switch">
								<input
									id="seller"
									type="checkbox"
									onChange={handleSeller}
								/>
								<span className="slider round"></span>
							</label>
						</div>
						<label htmlFor="country">Country</label>
						<input
							name="country"
							id="country"
							type="text"
							onChange={handleChange}
						/>
						<label htmlFor="phone">Phone Number</label>
						<input
							name="phone"
							type="number"
							id="phone"
							onChange={handleChange}
						/>
						<label htmlFor="desc">Description</label>
						<textarea
							placeholder="A short description of yourself"
							name="desc"
							id="desc"
							cols="30"
							rows="10"
							onChange={handleChange}
						></textarea>
					</div>
				</form>
			</div>
		</>
	);
}

export default Signup;
