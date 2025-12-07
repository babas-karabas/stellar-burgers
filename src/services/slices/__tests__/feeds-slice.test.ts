import { TFeedsState, feedsReducer } from '../feeds-slice';
import {
  loadFeeds,
  loadOrders,
  loadOrderByNumber
} from '../../actions/load-feeds';

describe('feedsSlice', function () {
  const initialState: TFeedsState = {
    feeds: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    loading: false,
    error: null,
    userOrders: [],
    orderForModal: null
  };

  const mockedOrders = [
    {
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
    },
    {
      _id: '6935bad8a64177001b322985',
      ingredients: [
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Био-марсианский минеральный антарианский краторный бургер',
      createdAt: '2025-12-07T17:35:20.516Z',
      updatedAt: '2025-12-07T17:35:20.808Z',
      number: 96646
    }
  ];

  const mockedFeeds = {
    orders: mockedOrders,
    total: 20641,
    totalToday: 218
  };

  it('загруженные заказы ленты сохранены в стор корректно', function () {
    const expectedState: TFeedsState = {
      ...initialState,
      feeds: mockedFeeds,
      loading: false
    };

    const actualState = feedsReducer(
      { ...initialState, loading: true },
      loadFeeds.fulfilled(mockedFeeds, '')
    );

    expect(actualState).toEqual(expectedState);
  });

  it('загруженная история заказов пользователя сохранена в стор корректно', function () {
    const expectedState: TFeedsState = {
      ...initialState,
      userOrders: mockedOrders,
      loading: false
    };

    const actualState = feedsReducer(
      { ...initialState, loading: true },
      loadOrders.fulfilled(mockedOrders, '')
    );

    expect(actualState).toEqual(expectedState);
  });

  it('загруженный по номеру заказ сохранен в стор корректно', function () {
    const expectedState: TFeedsState = {
      ...initialState,
      orderForModal: mockedOrders[0],
      loading: false
    };

    const actualState = feedsReducer(
      { ...initialState, loading: true },
      loadOrderByNumber.fulfilled(mockedOrders[0], '', 1)
    );

    expect(actualState).toEqual(expectedState);
  });
});
