import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../../utils/newRequest';
import './GigCard.scss';

const GigCard = ({ item }) => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['user', item.userId],
		queryFn: () => newRequest.get(`/users/${item.userId}`).then(res => res.data),
	});

	const stars = Math.round((item.totalStars * 10) / item.cntRating) / 10;
	return (
		<Link to={`/gig/${item._id}`} className="link">
			<div className="gigCard">
				<img src={item.cover} alt="" />

				<div className="info">
					{isLoading ? (
						'loading'
					) : error ? (
						'Cannot load seller details!'
					) : (
						<div className="user">
							<img src={data.img || '/img/noavatar.jpg'} alt="" />
							<span>{data.name}</span>
						</div>
					)}

					<p>{item.title}</p>
					<div className="star">
						<img src="./img/star.png" alt="" />
						<span>{stars || 'Not rated yet'}</span>
					</div>
				</div>

				<hr />
				<div className="detail">
					<img src="./img/heart.png" alt="" />
					<div className="price">
						<span>STARTING AT</span>
						<h2>&#8377; {item.price}</h2>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default GigCard;
