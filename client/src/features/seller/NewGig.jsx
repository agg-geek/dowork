import { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INITIAL_STATE, gigReducer } from '../../reducers/gigReducer';
import upload from '../../utils/upload';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser';
import './NewGig.scss';

const NewGig = () => {
	const [file, setFile] = useState(null);
	const [files, setFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');

	const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

	const handleChange = e => {
		dispatch({
			type: 'CHANGE_INPUT',
			payload: { name: e.target.name, value: e.target.value },
		});
	};

	const handleFeature = e => {
		e.preventDefault();
		dispatch({
			type: 'ADD_FEATURE',
			payload: e.target[0].value,
		});
		e.target[0].value = '';
	};

	const handleUpload = async () => {
		setUploading(true);
		try {
			const cover = await upload(file);

			const images = await Promise.all(
				[...files].map(async file => {
					const url = await upload(file);
					return url;
				})
			);
			dispatch({ type: 'ADD_IMAGES', payload: { cover, images } });
		} catch (err) {
			console.log(err);
			setError(err.response.data);
		} finally {
			setUploading(false);
		}
	};

	const navigate = useNavigate();

	const currentUser = getCurrentUser();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: gig => {
			return newRequest.post('/gigs', gig);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(['myGigs', currentUser._id]);
			navigate('/my-gigs');
		},
		onError: err => setError(err.response.data),
	});

	const handleSubmit = e => {
		e.preventDefault();
		mutation.mutate(state);
	};

	return (
		<div className="newGig">
			<div className="container">
				<h1>Add New Gig</h1>
				<div className="sections">
					<div className="info">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							id="title"
							name="title"
							onChange={handleChange}
							required
						/>
						<label htmlFor="category">Category</label>
						<select name="category" id="category" onChange={handleChange}>
							<option value="animation">Video & Animation</option>
							<option value="webdesign">Web Design</option>
							<option value="graphicdesign">Graphics & Design</option>
							<option value="dataentry">Data Entry</option>
							<option value="ai">AI Services</option>
							<option value="translation">Writing and Translation</option>
							<option value="social">Social Media</option>
							<option value="seo">SEO</option>
							<option value="voiceover">Voice Over</option>
							<option value="bookcover">Book Covers</option>
						</select>
						<div className="images">
							<div className="imagesInputs">
								<label htmlFor="cover">Cover Image</label>
								<input
									type="file"
									id="cover"
									name="cover"
									required
									onChange={e => setFile(e.target.files[0])}
								/>
								<label htmlFor="images">Upload Images</label>
								<input
									type="file"
									id="images"
									name="images"
									required
									multiple
									onChange={e => setFiles(e.target.files)}
								/>
							</div>
							<button onClick={handleUpload}>
								{uploading ? 'uploading' : 'Upload'}
							</button>
						</div>
						<button onClick={handleSubmit}>Create</button>
						{error && error}
					</div>
					<div className="details">
						<label htmlFor="add-features">Add Features</label>
						<form
							action=""
							id="add-features"
							className="add"
							required
							onSubmit={handleFeature}
						>
							<input type="text" />
							<button type="submit">Add</button>
						</form>
						<div className="addedFeatures">
							{state?.features?.map(f => (
								<div className="item" key={f}>
									<button
										onClick={() =>
											dispatch({
												type: 'REMOVE_FEATURE',
												payload: f,
											})
										}
									>
										{f}
										<span>X</span>
									</button>
								</div>
							))}
						</div>
						<label htmlFor="desc">Description</label>
						<textarea
							name="desc"
							id="desc"
							placeholder="Complete description of your service"
							cols="0"
							rows="16"
							required
							onChange={handleChange}
						></textarea>
						<label htmlFor="price">Price</label>
						<input
							type="number"
							id="price"
							onChange={handleChange}
							required
							name="price"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewGig;
