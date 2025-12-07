import { TUser } from '../../../utils/types';
import {
  TUserState,
  setIsAuthChecked,
  authSlice,
  authReducer,
  isPendingAction,
  isRejectedAction,
  initialState
} from '../auth-slice';
import {
  registerUser,
  loginUser,
  getUserThunk,
  updateUser,
  logoutUser
} from '../../actions/user-actions';
import { TRegisterData } from '../../../utils/burger-api';

import { configureStore } from '@reduxjs/toolkit';

describe('authSlice', function () {
  const userRegData: TRegisterData = {
    email: 'mail@mail.ru',
    name: 'Крузенштерн',
    password: 'password'
  };

  const userTestData: TUser = {
    email: 'mail2@mail.ru',
    name: 'Иван Федорович'
  };

  const userLoginData: Omit<TRegisterData, 'name'> = {
    email: 'mail@mail.ru',
    password: 'password'
  };

  const editedUserData = {
    email: 'mail222@mail.ru',
    name: 'Павка Корчагин'
  };

  it('при проверке пользователя меняется поле isAuthChecked', function () {
    const expectedState: TUserState = {
      ...initialState,
      isAuthChecked: true
    };
    const actualState = authReducer(initialState, setIsAuthChecked());
    expect(actualState).toEqual(expectedState);
  });

  it('при регистрации пользователя меняется поле user', function () {
    const expectedState: TUserState = {
      ...initialState,
      isAuthenticated: true,
      user: userTestData
    };

    const actualState = authReducer(
      initialState,
      registerUser.fulfilled(userTestData, '', userRegData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при входе в приложение происходит аутентификация', function () {
    const expectedState: TUserState = {
      ...initialState,
      isAuthenticated: true,
      user: userTestData
    };

    const actualState = authReducer(
      initialState,
      loginUser.fulfilled(userTestData, '', userLoginData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при загрузке приложения происходит идентификация пользователя', function () {
    const expectedState: TUserState = {
      ...initialState,
      isAuthenticated: true,
      user: userTestData
    };

    const actualState = authReducer(
      initialState,
      getUserThunk.fulfilled(userTestData, '')
    );
    expect(actualState).toEqual(expectedState);
  });

  it('данные пользователя обновляются', function () {
    const expectedState: TUserState = {
      ...initialState,
      user: editedUserData
    };

    const actualState = authReducer(
      { ...initialState, user: userTestData },
      updateUser.fulfilled(editedUserData, '', editedUserData)
    );
    expect(actualState).toEqual(expectedState);
  });

  it('данные пользователя очищаются при выходе из приложения', function () {
    const expectedState: TUserState = initialState;

    const actualState = authReducer(
      { ...initialState, user: userTestData },
      logoutUser.fulfilled(true, '')
    );
    expect(actualState).toEqual(expectedState);
  });

  describe('мэтчеры работают корректно', () => {
    describe('isPendingAction', () => {
      it('должен возвращать true для pending экшенов с правильным префиксом', () => {
        const matcher = isPendingAction('auth');
        expect(matcher({ type: 'auth/loginUser/pending' })).toBe(true);
        expect(matcher({ type: 'auth/registerUser/pending' })).toBe(true);
      });

      it('должен возвращать false для экшенов с другим префиксом', () => {
        const matcher = isPendingAction('auth');
        expect(matcher({ type: 'orders/fetchOrders/pending' })).toBe(false);
      });

      it('должен возвращать false для non-pending экшенов', () => {
        const matcher = isPendingAction('auth');
        expect(matcher({ type: 'auth/loginUser/fulfilled' })).toBe(false);
        expect(matcher({ type: 'auth/loginUser/rejected' })).toBe(false);
      });
    });

    describe('isRejectedAction', () => {
      it('должен возвращать true для rejected экшенов с правильным префиксом', () => {
        const matcher = isRejectedAction('auth');
        expect(matcher({ type: 'auth/loginUser/rejected' })).toBe(true);
      });

      it('должен возвращать false для других состояний', () => {
        const matcher = isRejectedAction('auth');
        expect(matcher({ type: 'auth/loginUser/pending' })).toBe(false);
        expect(matcher({ type: 'auth/loginUser/fulfilled' })).toBe(false);
      });
    });
  });

  describe('authSlice matchers', () => {
    let store: ReturnType<
      typeof configureStore<{
        auth: TUserState;
      }>
    >;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          auth: authReducer
        }
      });
    });

    describe('isPendingAction matcher', () => {
      it('должен устанавливать loginUserRequest в true и очищать ошибки при pending состоянии с префиксом auth', () => {
        // Диспатчим экшен с префиксом 'auth', чтобы matcher сработал
        store.dispatch({ type: 'auth/someAction/pending' });
        const state = store.getState().auth;

        expect(state.loginUserRequest).toBe(true);
        expect(state.loginUserError).toBeNull();
      });

      it('должен устанавливать loginUserRequest в true для любых pending экшенов с префиксом auth', () => {
        // Диспатчим другой экшен с префиксом 'auth'
        store.dispatch({ type: 'auth/anotherAction/pending' });
        const state = store.getState().auth;

        expect(state.loginUserRequest).toBe(true);
        expect(state.loginUserError).toBeNull();
      });

      it('должен очищать предыдущие ошибки при новом pending запросе', () => {
        // Сначала устанавливаем ошибку через rejected экшен
        store.dispatch({ type: 'auth/someAction/rejected' });

        // Затем отправляем pending
        store.dispatch({ type: 'auth/someAction/pending' });

        const state = store.getState().auth;
        expect(state.loginUserError).toBeNull();
        expect(state.loginUserRequest).toBe(true);
      });
    });

    describe('isRejectedAction matcher', () => {
      it('должен устанавливать loginUserRequest в false и записывать ошибку при rejected состоянии', () => {
        store.dispatch({ type: 'auth/loginUser/rejected' });
        const state = store.getState().auth;

        expect(state.loginUserRequest).toBe(false);
        expect(state.loginUserError).toBe('Error of auth/loginUser/rejected');
      });

      it('должен обрабатывать rejected для всех auth экшенов', () => {
        store.dispatch({ type: 'auth/registerUser/rejected' });
        const state = store.getState().auth;

        expect(state.loginUserRequest).toBe(false);
        expect(state.loginUserError).toContain('auth/registerUser/rejected');
      });

      it('должен корректно обрабатывать последовательность pending -> rejected', () => {
        // Pending
        store.dispatch({ type: 'auth/someAction/pending' });
        expect(store.getState().auth.loginUserRequest).toBe(true);

        // Rejected
        store.dispatch({ type: 'auth/someAction/rejected' });

        const state = store.getState().auth;
        expect(state.loginUserRequest).toBe(false);
        expect(state.loginUserError).toBeTruthy();
      });
    });

    describe('matcher не должен срабатывать на посторонние экшены', () => {
      it('не должен реагировать на экшены не из auth prefix', () => {
        const initialState = store.getState().auth;

        // Диспатчим экшен с другим префиксом
        store.dispatch({ type: 'orders/fetchOrders/pending' });

        const state = store.getState().auth;
        expect(state).toEqual(initialState);
      });

      it('не должен реагировать на fulfilled экшены через matcher', () => {
        // fulfilled не обрабатывается matcher'ами для pending/rejected
        store.dispatch({ type: 'auth/someAction/fulfilled' });
        const state = store.getState().auth;

        // loginUserRequest должен оставаться false (matcher не сработал для fulfilled)
        expect(state.loginUserRequest).toBe(false);
        expect(state.loginUserError).toBeNull();
      });
    });
  });
});
