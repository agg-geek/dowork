import { useQuery } from '@tanstack/react-query';
import newRequest from '../../../utils/newRequest';
import './Review.scss';

const Review = ({ review }) => {
	const { isLoading, error, data } = useQuery({
		queryKey: ['user', review.userId],
		queryFn: () => newRequest.get(`/users/${review.userId}`).then(res => res.data),
	});

	return (
		<div className="review">
			{isLoading ? (
				'loading'
			) : error ? (
				'error'
			) : (
				<div className="user">
					<img
						className="sellerAvatar"
						src={data.img || '/img/noavatar.jpg'}
						alt=""
					/>
					<div className="info">
						<span>{data.name}</span>
						<div className="country">
							<span>{data.country}</span>
						</div>
					</div>
				</div>
			)}

			<div className="stars">
				{Array.from({ length: review.star }, (_, i) => (
					<img src="/img/star.png" alt="" key={i} />
				))}
				<span>{review.star}</span>
			</div>

			<p>{review.desc}</p>
		</div>
	);
};

export default Review;
