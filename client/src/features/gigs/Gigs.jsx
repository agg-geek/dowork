import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import GigCard from './components/GigCard';
import newRequest from '../../utils/newRequest';
import './Gigs.scss';

function Gigs() {
	const [sort, setSort] = useState('sales');
	const [openSortMenu, setOpenSortMenu] = useState(false);

	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');

	const [searchParams] = useSearchParams();

	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['gigs', searchParams.toString(), sort],
		queryFn: () =>
			newRequest
				.get(
					`/gigs?${searchParams.toString()}&min=${minPrice}&max=${maxPrice}&sort=${sort}`
				)
				.then(res => res.data),
	});

	const reSort = type => {
		setSort(type);
		setOpenSortMenu(false);
	};

	function capitalizeFirstLetter(string) {
		if (!string) return;
		if (string === 'ai') return 'AI';
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}

	let category = capitalizeFirstLetter(searchParams.get('category'));
	let searchTerm = capitalizeFirstLetter(searchParams.get('search'));
	let title;

	if (category) {
		if (searchTerm) title = `Results for ${searchTerm} in ${category} category`;
		else title = `Results for ${category} category`;
	} else if (searchTerm) title = `Results for ${searchTerm}`;
	else title = 'All Gigs';

	return (
		<div className="gigs">
			<div className="container">
				<h1>{title}</h1>
				<div className="menu">
					<div className="left">
						<span>Budget</span>
						<input
							value={minPrice}
							type="number"
							placeholder="min"
							onChange={e => setMinPrice(e.target.value)}
						/>
						<input
							value={maxPrice}
							type="number"
							placeholder="max"
							onChange={e => setMaxPrice(e.target.value)}
						/>
						<button onClick={refetch}>Apply</button>
					</div>
					<div className="right">
						<span className="sortBy">Sort by</span>
						<span className="sortType">
							{sort === 'sales' ? 'Best Selling' : 'Newest'}
						</span>
						<img
							src="./img/down.png"
							alt=""
							onClick={() => setOpenSortMenu(open => !open)}
						/>

						{openSortMenu && (
							<div className="rightMenu">
								{sort === 'sales' ? (
									<span onClick={() => reSort('createdAt')}>
										Newest
									</span>
								) : (
									<span onClick={() => reSort('sales')}>
										Best Selling
									</span>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="cards">
					{isLoading
						? 'loading'
						: error
						? 'Something went wrong!'
						: data.map(gig => <GigCard key={gig._id} item={gig} />)}
				</div>
			</div>
		</div>
	);
}

export default Gigs;
