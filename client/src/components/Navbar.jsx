import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import newRequest from '../utils/newRequest';
import category from '../data/category.json';
import getCurrentUser from '../utils/getCurrentUser.js';
import './Navbar.scss';

function Navbar() {
	const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);

	const { pathname } = useLocation();

	const [isNavbarActive, setIsNavbarActive] = useState(false);
	const scrollNavbar = () => {
		window.scrollY > 0 ? setIsNavbarActive(true) : setIsNavbarActive(false);
	};
	useEffect(() => {
		window.addEventListener('scroll', scrollNavbar);
		return () => window.removeEventListener('scroll', scrollNavbar);
	}, []);

	const currentUser = getCurrentUser();

	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await newRequest.post('/auth/logout');
			localStorage.setItem('currentUser', null);
			navigate('/');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className={isNavbarActive || pathname !== '/' ? 'navbar active' : 'navbar'}>
			<div className="container">
				<div className="logo">
					<Link className="link" to="/">
						<span className="text">doWork</span>
					</Link>
					<span className="dot">.</span>
				</div>
				<div className="links">
					<Link className="link" to="/gigs">
						<span className="text">Gigs</span>
					</Link>
					<a href="#about" className="link">
						<span className="text">About</span>
					</a>
					{currentUser ? (
						<div
							className="user"
							onClick={() => setIsOpenUserMenu(open => !open)}
						>
							<img src={currentUser.img || '/img/noavatar.jpg'} alt="" />
							<span>{currentUser.name}</span>
							{isOpenUserMenu && (
								<div className="options">
									{currentUser.isSeller && (
										<>
											<Link className="link" to="/my-gigs">
												My Gigs
											</Link>
											<Link className="link" to="/new-gig">
												Create new Gig
											</Link>
										</>
									)}
									<Link className="link" to="/orders">
										Orders
									</Link>
									<Link className="link" to="/messages">
										Messages
									</Link>
									<Link className="link" onClick={handleLogout}>
										Logout
									</Link>
								</div>
							)}
						</div>
					) : (
						<>
							<Link to="/login" className="link">
								Login
							</Link>
							<Link to="/signup" className="link">
								<button>Sign up</button>
							</Link>
						</>
					)}
				</div>
			</div>
			{(isNavbarActive || pathname !== '/') && (
				<>
					<hr />
					<div className="menu">
						{category.map((c, i) => (
							<Link key={i} className="link menuLink" to={c.link}>
								{c.title}
							</Link>
						))}
					</div>
					<hr />
				</>
			)}
		</div>
	);
}

export default Navbar;
