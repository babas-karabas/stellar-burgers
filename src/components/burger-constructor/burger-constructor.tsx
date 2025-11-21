import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import { getConstructor } from '../../services/slices/constructor-slice';
import {
  getNewOrder,
  getOrderStatus,
  clearOrderConstructor
} from '../../services/slices/order-slice';
import { useDispatch } from '../../services/store';
import { sendOrder } from '../../services/actions/send-order';
import { redirect, useNavigate } from 'react-router-dom';
import { getUser } from '../../services/slices/auth-slice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(getConstructor);
  const user = useSelector(getUser);
  const orderRequest = useSelector(getOrderStatus);

  const orderModalData = useSelector(getNewOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      dispatch(
        sendOrder([
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((ingredient) => ingredient._id)
        ])
      );
      return () => dispatch(clearOrderConstructor());
    }
  };

  const closeOrderModal = () => navigate(-1);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
