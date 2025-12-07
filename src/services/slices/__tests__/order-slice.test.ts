import { TOrderState, orderReducer } from '../order-slice';
import { sendOrder } from '../../actions/send-order';

describe('ingredientsSlice', function () {
  const initialState: TOrderState = {
    data: null,
    loading: false,
    error: undefined
  };

  const mockedOrder = {
    _id: '6935be00a64177001b322988',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d'
    ],
    status: 'done',
    name: 'Био-марсианский флюоресцентный люминесцентный бургер',
    createdAt: '2025-12-07T17:48:48.256Z',
    updatedAt: '2025-12-07T17:48:48.548Z',
    number: 96647
  };

  it('отправленный заказ сохранен в стор корректно', function () {
    const expectedState: TOrderState = {
      ...initialState,
      data: mockedOrder
    };

    const actualState = orderReducer(
      { ...initialState, loading: true },
      sendOrder.fulfilled(mockedOrder, '', [])
    );

    expect(actualState).toEqual(expectedState);
  });

  it('при отправке заказа меняется поле loading', function () {
    const expectedState: TOrderState = {
      ...initialState,
      loading: true,
      error: ''
    };

    const actualState = orderReducer(
      { ...initialState, error: 'test error' },
      sendOrder.pending('', [])
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при ошибке отправки заказа меняется поле error', function () {
    const error = new Error('test error');
    const expectedState: TOrderState = {
      ...initialState,
      error: error.message
    };

    const actualState = orderReducer(
      initialState,
      sendOrder.rejected(error, '', [])
    );
    expect(actualState).toEqual(expectedState);
  });
});
