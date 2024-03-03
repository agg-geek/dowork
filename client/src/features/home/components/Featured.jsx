import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Featured.scss';

function Featured() {
	const [input, setInput] = useState('');
	const navigate = useNavigate();

	const handleSubmit = () => {
		navigate(`/gigs?search=${input}`);
	};

	return (
		<div className="featured">
			<div className="container">
				<div className="left">
					<h1>
						Find the perfect <span>freelance</span> services for your business
					</h1>
					<div className="search">
						<div className="searchInput">
							<img src="./img/search.png" alt="" />
							<input
								type="text"
								placeholder='Try "design"'
								onChange={e => setInput(e.target.value)}
							/>
						</div>
						<button onClick={handleSubmit}>Search</button>
					</div>
					<div className="popular">
						<span>Popular:</span>
						<Link className="link" to="/gigs?category=ai">
							<button>AI Services</button>
						</Link>
						<Link className="link" to="/gigs?category=webdesign">
							<button>Web Design</button>
						</Link>
						<Link className="link" to="/gigs?category=dataentry">
							<button>Data Entry</button>
						</Link>
						<Link className="link" to="/gigs?category=animation">
							<button>Animation</button>
						</Link>
					</div>
				</div>
				<div className="right">
					<img src="./img/man.png" alt="" />
				</div>
			</div>
		</div>
	);
}

export default Featured;
