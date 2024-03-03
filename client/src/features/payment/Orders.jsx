import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest.js';
import getCurrentUser from '../../utils/getCurrentUser.js';
import './Orders.scss';

const Orders = () => {
	const currentUser = getCurrentUser();

	const navigate = useNavigate();
	const { isLoading, error, data } = useQuery({
		queryKey: ['orders', currentUser._id],
		queryFn: () => newRequest.get(`/orders`).then(res => res.data),
	});

	const handleContact = async order => {
		const sellerId = order.sellerId;
		const buyerId = order.buyerId;
		const id = sellerId + buyerId;

		try {
			const res = await newRequest.get(`/conversations/${id}`);
			navigate(`/message/${res.data.id}`);
		} catch (err) {
			if (err.response.status === 404) {
				const res = await newRequest.post('/conversations', {
					to: currentUser.isSeller ? buyerId : sellerId,
				});
				navigate(`/message/${res.data.id}`);
			}
		}
	};

	return (
		<div className="orders">
			{isLoading ? (
				'loading'
			) : error ? (
				'error'
			) : (
				<div className="container">
					<div className="title">
						<h1>Orders</h1>
					</div>
					<table>
						<thead>
							<tr>
								<th>Image</th>
								<th>Title</th>
								<th>Price</th>
								<th>Contact</th>
							</tr>
						</thead>
						<tbody>
							{data.map(order => (
								<tr key={order._id}>
									<td>
										<img className="image" src={order.img} alt="" />
									</td>
									<td>{order.title}</td>
									<td>{order.price}</td>
									<td>
										<img
											className="message"
											src="./img/message.png"
											alt=""
											onClick={() => handleContact(order)}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default Orders;
