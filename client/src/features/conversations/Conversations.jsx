import moment from 'moment';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser.js';
import './Conversations.scss';

const Messages = () => {
	const currentUser = getCurrentUser();

	const queryClient = useQueryClient();

	const { isLoading, error, data } = useQuery({
		queryKey: ['conversations', currentUser._id],
		queryFn: () => newRequest.get(`/conversations`).then(res => res.data),
	});

	const mutation = useMutation({
		mutationFn: id => {
			return newRequest.patch(`/conversations/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['conversations', currentUser._id]);
		},
	});

	const handleRead = id => {
		mutation.mutate(id);
	};

	return (
		<div className="messages">
			{isLoading ? (
				'loading'
			) : error ? (
				'error'
			) : (
				<div className="container">
					<div className="title">
						<h1>Messages</h1>
					</div>
					<table>
						<thead>
							<tr>
								<th>{currentUser.isSeller ? 'Buyer' : 'Seller'}</th>
								<th>Last Message</th>
								<th>Time</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{data.map(c => (
								<tr
									className={
										((currentUser.isSeller && !c.readBySeller) ||
											(!currentUser.isSeller && !c.readByBuyer)) &&
										'active'
									}
									key={c.id}
								>
									<td>
										{currentUser.isSeller ? c.buyerId : c.sellerId}
									</td>
									<td>
										<Link to={`/message/${c.id}`} className="link">
											{c?.lastMessage?.substring(0, 100)}...
										</Link>
									</td>

									<td>{moment(c.updatedAt).fromNow()}</td>
									<td>
										{((currentUser.isSeller && !c.readBySeller) ||
											(!currentUser.isSeller &&
												!c.readByBuyer)) && (
											<button onClick={() => handleRead(c.id)}>
												Mark as Read
											</button>
										)}
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

export default Messages;
