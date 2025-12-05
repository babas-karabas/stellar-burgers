import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/auth-slice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUser);
  return <AppHeaderUI userName={userName?.name} />;
};
