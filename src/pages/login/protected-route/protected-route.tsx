import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { userSelectors } from '../../services/slices/user';
import Spinner from '../spinner/spinner';

type ProtectedRouteProps = {
	onlyUnAuth?: boolean;
	children: React.ReactNode;
};

function ProtectedRoute({ children, onlyUnAuth }: ProtectedRouteProps) {
	const location = useLocation();
	const user = useSelector(userSelectors.getUser);
	const isAuthChecked = useSelector(userSelectors.getIsAuthChecked);

	if (!isAuthChecked) {
		console.log('WAIT USER CHECKOUT');
		return <Spinner />;
	}

	if (onlyUnAuth && user) {
		console.log('NAVIGATE FROM LOGIN TO INDEX');
		const from = location.state?.from || { pathname: '/' };
		const backgroundLocation = location.state?.from?.background || null;
		return <Navigate replace to={from} state={{ background: backgroundLocation }} />;
	}

	if (!onlyUnAuth && !user) {
		console.log('NAVIGATE FROM PAGE TO LOGIN');
		return <Navigate replace to={'/login'} state={{ from: {...location, background: location.state?.background, state: null}}} />;
	}

	console.log('RENDER COMPONENT');

	return children;
}

export default ProtectedRoute;
