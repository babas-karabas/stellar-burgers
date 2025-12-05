import { FC, SyntheticEvent, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  getConstructor,
  clearConstructor
} from '../../services/slices/constructor-slice';
import {
  clearOrderData,
  getNewOrder,
  getOrderStatus
} from '../../services/slices/order-slice';
import { useDispatch } from '../../services/store';
import { sendOrder } from '../../services/actions/send-order';
import { useNavigate } from 'react-router-dom';
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
      return;
    }

    dispatch(
      sendOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ingredient) => ingredient._id)
      ])
    )
      .then(() => dispatch(clearConstructor()))
      .catch((err) => err);
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

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
