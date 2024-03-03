import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Slider } from 'infinite-react-carousel/lib';
import moment from 'moment';
import newRequest from '../../utils/newRequest';
import Reviews from './components/Reviews';
import getCurrentUser from '../../utils/getCurrentUser';
import './Gig.scss';

function Gig() {
	const { id } = useParams();

	const { isLoading, error, data } = useQuery({
		queryKey: ['gig', id],
		queryFn: () => newRequest.get(`/gigs/${id}`).then(res => res.data),
	});

	const userId = data?.userId;

	const {
		isLoading: isLoadingSeller,
		error: errorSeller,
		data: dataSeller,
	} = useQuery({
		queryKey: ['user', userId],
		queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
		enabled: !!userId,
	});

	const currentUser = getCurrentUser();

	return (
		<div className="gig">
			{isLoading ? (
				'loading'
			) : error ? (
				'Cannot fetch gig'
			) : (
				<div className="container">
					<div className="left">
						<h1>{data.title}</h1>
						{isLoadingSeller ? (
							'loading'
						) : errorSeller ? (
							'Cannot fetch seller details'
						) : (
							<div className="user">
								<img
									className="sellerAvatar"
									src={dataSeller.img || '/img/noavatar.jpg'}
									alt=""
								/>
								<span>{dataSeller.name}</span>
								{!isNaN(data.totalStars / data.cntRating) && (
									<div className="stars">
										{Array.from(
											{
												length: Math.round(
													data.totalStars / data.cntRating
												),
											},
											(_, i) => (
												<img src="/img/star.png" alt="" key={i} />
											)
										)}
										<span>
											{Math.round(
												(data.totalStars * 10) / data.cntRating
											) / 10}
										</span>
									</div>
								)}
							</div>
						)}

						{data.images.length > 0 && (
							<Slider slidesToShow={1} arrowsScroll={1} className="slider">
								{data.images.map(img => (
									<img key={img} src={img} alt="" />
								))}
							</Slider>
						)}

						<h2>About This Gig</h2>
						<p>{data.desc}</p>

						{isLoadingSeller ? (
							'loading'
						) : errorSeller ? (
							'Cannot fetch seller details'
						) : (
							<div className="seller">
								<h2>About The Seller</h2>
								<div className="user">
									<img
										src={dataSeller.img || '/img/noavatar.jpg'}
										alt=""
									/>
									<div className="info">
										<span>{dataSeller.name}</span>
										{!isNaN(data.totalStars / data.cntRating) && (
											<div className="stars">
												{Array.from(
													{
														length: Math.round(
															data.totalStars /
																data.cntRating
														),
													},
													(item, i) => (
														<img
															src="/img/star.png"
															alt=""
															key={i}
														/>
													)
												)}
												<span>
													{Math.round(
														data.totalStars / data.cntRating
													)}
												</span>
											</div>
										)}
										<button>Contact Me</button>
									</div>
								</div>
								<div className="box">
									<div className="items">
										<div className="item">
											<span className="title">From</span>
											<span className="desc">
												{dataSeller.country}
											</span>
										</div>
										<div className="item">
											<span className="title">Member since</span>
											<span className="desc">
												{moment(dataSeller.createdAt).format(
													'MMMM YYYY'
												)}
											</span>
										</div>
									</div>
									<hr />
									<p>{dataSeller.desc}</p>
								</div>
							</div>
						)}

						<Reviews gigId={id} />
					</div>
					<div className="right">
						<div className="price">
							<h2>&#8377; {data.price}</h2>
						</div>
						<div className="features">
							{data.features.map(feature => (
								<div className="item" key={feature}>
									<img src="/img/greencheck.png" alt="" />
									<span>{feature}</span>
								</div>
							))}
						</div>
						{currentUser && (
							<Link to={`/pay/${id}`}>
								<button>Purchase</button>
							</Link>
						)}
						{!currentUser && (
							<Link to={`/login`}>
								<button>Sign in to purchase</button>
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default Gig;
