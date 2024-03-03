import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './features/home/Home';
import Gigs from './features/gigs/Gigs';
import MyGigs from './features/seller/MyGigs';
import Orders from './features/payment/Orders';
import Conversations from './features/conversations/Conversations';
import Message from './features/conversations/Message';
import Gig from './features/gigs/Gig';
import NewGig from './features/seller/NewGig';
import Signup from './features/auth/Signup';
import Login from './features/auth/Login';
import Payment from './features/payment/Payment';
import Success from './features/payment/Success';
import './App.scss';

const queryClient = new QueryClient();

function Layout() {
	return (
		<div className="app">
			<QueryClientProvider client={queryClient}>
				<Navbar />
				<Outlet />
				<Footer />
			</QueryClientProvider>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ path: '/', element: <Home /> },
			{ path: '/signup', element: <Signup /> },
			{ path: '/login', element: <Login /> },
			{ path: '/gigs', element: <Gigs /> },
			{ path: '/gig/:id', element: <Gig /> },
			{ path: '/new-gig', element: <NewGig /> },
			{ path: '/my-gigs', element: <MyGigs /> },
			{ path: '/pay/:id', element: <Payment /> },
			{ path: '/payment-success', element: <Success /> },
			{ path: '/orders', element: <Orders /> },
			{ path: '/messages', element: <Conversations /> },
			{ path: '/message/:id', element: <Message /> },
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
