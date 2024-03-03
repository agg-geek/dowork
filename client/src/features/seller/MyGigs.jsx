import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getCurrentUser from '../../utils/getCurrentUser';
import newRequest from '../../utils/newRequest';
import './MyGigs.scss';

function MyGigs() {
	const currentUser = getCurrentUser();

	const queryClient = useQueryClient();

	const { isLoading, error, data } = useQuery({
		queryKey: ['myGigs', currentUser._id],
		queryFn: () =>
			newRequest.get(`/gigs?userId=${currentUser._id}`).then(res => res.data),
	});

	const mutation = useMutation({
		mutationFn: id => {
			return newRequest.delete(`/gigs/${id}`);
		},
		onSuccess: () => queryClient.invalidateQueries(['myGigs', currentUser._id]),
	});

	const handleDelete = id => {
		mutation.mutate(id);
	};

	return (
		<div className="myGigs">
			{isLoading ? (
				'loading'
			) : error ? (
				'error'
			) : (
				<div className="container">
					<div className="title">
						<h1>Gigs</h1>
						{currentUser.isSeller && (
							<Link to="/new-gig">
								<button>Create new gig</button>
							</Link>
						)}
					</div>
					<table>
						<thead>
							<tr>
								<th>Image</th>
								<th>Title</th>
								<th>Price</th>
								<th>Sales</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{data.map(gig => (
								<tr key={gig._id}>
									<td>
										<img className="image" src={gig.cover} alt="" />
									</td>
									<td>{gig.title}</td>
									<td>{gig.price}</td>
									<td>{gig.sales}</td>
									<td>
										<img
											className="delete"
											src="./img/delete.png"
											alt=""
											onClick={() => handleDelete(gig._id)}
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
}

export default MyGigs;
