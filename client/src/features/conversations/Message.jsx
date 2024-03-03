import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser.js';
import './Message.scss';

const Message = () => {
	const { id } = useParams();
	const currentUser = getCurrentUser();

	const queryClient = useQueryClient();

	const { isLoading, error, data } = useQuery({
		queryKey: ['message', id],
		queryFn: () => newRequest.get(`/messages/${id}`).then(res => res.data),
	});

	const { data: user } = useQuery({
		queryKey: ['user', currentUser._id],
		queryFn: () => newRequest.get(`/users/${currentUser._id}`).then(res => res.data),
	});

	const mutation = useMutation({
		mutationFn: message => {
			return newRequest.post(`/messages`, message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['message', id]);
		},
	});

	const handleSubmit = e => {
		e.preventDefault();
		mutation.mutate({
			conversationId: id,
			desc: e.target[0].value,
		});
		e.target[0].value = '';
	};

	return (
		<div className="message">
			<div className="container">
				{isLoading ? (
					'loading'
				) : error ? (
					'error'
				) : (
					<div className="messages">
						{data.map(m => (
							<div
								className={
									m.userId === currentUser._id ? 'owner item' : 'item'
								}
								key={m._id}
							>
								<img
									src={
										m.userId === currentUser._id
											? user?.img || '/img/noavatar.jpg'
											: '/img/noavatar.jpg'
									}
									alt=""
								/>
								<p>{m.desc}</p>
							</div>
						))}
					</div>
				)}

				<hr />
				<form className="write" onSubmit={handleSubmit}>
					<textarea type="text" placeholder="write a message" />
					<button type="submit">Send</button>
				</form>
			</div>
		</div>
	);
};

export default Message;
