import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

//import { userSelectors } from '../../services/slices/user';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children, onlyAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  //const user = useSelector(userSelectors.getUser);
  //const isAuthChecked = useSelector(userSelectors.getIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.background || null;
    return (
      <Navigate replace to={from} state={{ background: backgroundLocation }} />
    );
  }

  if (onlyAuth && !user) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  return children;
};
