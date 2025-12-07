import { rootReducer } from '../store/store';
import { ingredientsReducer } from '../slices/ingredients-slice';
import { authReducer } from '../slices/auth-slice';
import { constructorReducer } from '../slices/constructor-slice';

import { feedsReducer } from '../slices/feeds-slice';

import { orderReducer } from '../slices/order-slice';

describe('стор инициализирован правильно', function () {
  it('экшн @@INIT обрабатывается верно', function () {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      auth: authReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      feeds: feedsReducer(undefined, initAction),
      order: orderReducer(undefined, initAction)
    });
  });
  it('несуществующий запрос обрабатыватся корректно', function () {
    const fakeAction = { type: 'FAKE_ACTION' };
    const state = rootReducer(undefined, fakeAction);
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, fakeAction),
      auth: authReducer(undefined, fakeAction),
      burgerConstructor: constructorReducer(undefined, fakeAction),
      feeds: feedsReducer(undefined, fakeAction),
      order: orderReducer(undefined, fakeAction)
    });
  });
});
