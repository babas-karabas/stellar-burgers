import { TFeedsState, feedsReducer, initialState } from '../feeds-slice';
import {
  loadFeeds,
  loadOrders,
  loadOrderByNumber
} from '../../actions/load-feeds';
import { configureStore } from '@reduxjs/toolkit';

describe('feedsSlice', function () {
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

  describe('feedsSlice matchers', () => {
    let store: ReturnType<
      typeof configureStore<{
        feeds: TFeedsState;
      }>
    >;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          feeds: feedsReducer
        }
      });
    });

    describe('isPendingAction matcher', () => {
      it('должен устанавливать loading в true и очищать ошибки при pending состоянии с префиксом feeds', () => {
        // Диспатчим экшен с префиксом 'feeds', чтобы matcher сработал
        store.dispatch({ type: 'feeds/someAction/pending' });
        const state = store.getState().feeds;

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен устанавливать loading в true для любых pending экшенов с префиксом feeds', () => {
        // Диспатчим другой экшен с префиксом 'auth'
        store.dispatch({ type: 'feeds/anotherAction/pending' });
        const state = store.getState().feeds;

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('должен очищать предыдущие ошибки при новом pending запросе', () => {
        // Сначала устанавливаем ошибку через rejected экшен
        store.dispatch({ type: 'feeds/someAction/rejected' });

        // Затем отправляем pending
        store.dispatch({ type: 'feeds/someAction/pending' });

        const state = store.getState().feeds;
        expect(state.error).toBeNull();
        expect(state.loading).toBe(true);
      });
    });

    describe('isRejectedAction matcher', () => {
      it('должен устанавливать loading в false и записывать ошибку при rejected состоянии', () => {
        store.dispatch({ type: 'feeds/loadOrders/rejected' });
        const state = store.getState().feeds;

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Error of feeds/loadOrders/rejected');
      });

      it('должен обрабатывать rejected для всех feeds экшенов', () => {
        store.dispatch({ type: 'feeds/loadOrderByNumber/rejected' });
        const state = store.getState().feeds;

        expect(state.loading).toBe(false);
        expect(state.error).toContain('feeds/loadOrderByNumber/rejected');
      });

      it('должен корректно обрабатывать последовательность pending -> rejected', () => {
        // Pending
        store.dispatch({ type: 'feeds/someAction/pending' });
        expect(store.getState().feeds.loading).toBe(true);

        // Rejected
        store.dispatch({ type: 'feeds/someAction/rejected' });

        const state = store.getState().feeds;
        expect(state.loading).toBe(false);
        expect(state.error).toBeTruthy();
      });
    });

    describe('matcher не должен срабатывать на посторонние экшены', () => {
      it('не должен реагировать на экшены не из feeds prefix', () => {
        const initialState = store.getState().feeds;

        // Диспатчим экшен с другим префиксом
        store.dispatch({ type: 'orders/fetchOrders/pending' });

        const state = store.getState().feeds;
        expect(state).toEqual(initialState);
      });

      it('не должен реагировать на fulfilled экшены через matcher', () => {
        // fulfilled не обрабатывается matcher'ами для pending/rejected
        store.dispatch({ type: 'feeds/someAction/fulfilled' });
        const state = store.getState().feeds;

        // loginUserRequest должен оставаться false (matcher не сработал для fulfilled)
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });
    });
  });
});
