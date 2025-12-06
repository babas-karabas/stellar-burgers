import { TUser } from '../../utils/types';
import { TUserState, setIsAuthChecked, authReducer } from './auth-slice';
import {
  loginUser,
  getUserThunk,
  registerUser,
  updateUser,
  logoutUser
} from '../actions/user-actions';

describe('authSlice', function () {
  const initialState: TUserState = {
    isAuthChecked: false,
    isAuthenticated: false,
    user: null,
    loginUserError: null,
    loginUserRequest: false
  };

  const userRegData = {
    email: 'mail@mail.ru',
    name: 'Крузенштерн',
    password: 'password'
  };

  const userTestData: TUser = {
    email: 'mail2@mail.ru',
    name: 'Иван Федорович'
  };

  it('при проверке пользователя меняется поле isAuthChecked', function () {
    const expectedState: TUserState = {
      ...initialState,
      isAuthChecked: true
    };
    const actualState = authReducer(initialState, setIsAuthChecked());
    expect(actualState).toEqual(expectedState);
  });
});
