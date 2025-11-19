import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loadOrders } from '../../services/actions/load-feeds';
import { getOrders } from '../../services/slices/feeds-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadOrders());
  }, []);

  const orders: TOrder[] = useSelector(getOrders);

  return <ProfileOrdersUI orders={orders} />;
};
