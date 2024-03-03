import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import CheckoutForm from './CheckoutForm';

const STRIPE_PUBLIC_KEY =
	'pk_test_51NeXnsSFUMsEEt596hvkPn9Anqr3btgxEgLsnyrBCJ5wHIlg22ID59tU5en4aI8AFLEzWq3rXpnZrnCfIXAtkTQH0039oh3soj';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Payment = () => {
	const [clientSecret, setClientSecret] = useState('');

	const { id } = useParams();

	useEffect(() => {
		const makeRequest = async () => {
			try {
				const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
				setClientSecret(res.data.clientSecret);
			} catch (err) {
				console.log(err);
			}
		};
		makeRequest();
	}, [id]);

	const appearance = {
		theme: 'stripe',
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div className="payment">
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</div>
	);
};

export default Payment;
