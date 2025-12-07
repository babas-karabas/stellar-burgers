import { TConstructorIngredient, TIngredient } from './../../../utils/types';
import {
  TConstructorState,
  constructorSlice,
  setBun,
  setOtherIngredients,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
  constructorReducer
} from '../constructor-slice';

describe('constructorSlice', function () {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockedIngredients = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },

    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    },

    {
      _id: '3',
      name: 'Соус',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ];

  it('при добавлении булки меняется поле bun', function () {
    const expectedState: TConstructorState = {
      ...initialState,
      bun: mockedIngredients[0]
    };

    const actualState = constructorReducer(
      initialState,
      setBun(mockedIngredients[0])
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при добавлении ингредиента меняется поле ingredients', function () {
    const actualState = constructorReducer(
      initialState,
      setOtherIngredients(mockedIngredients[1])
    );
    expect(actualState.ingredients).toHaveLength(1);
    expect(actualState.ingredients[0]).toEqual({
      ...mockedIngredients[1],
      id: expect.any(String)
    });
  });

  it('при удалении ингредиента меняется поле ingredients', function () {
    const mockedIngredient = { ...mockedIngredients[1], id: '1' };
    const actualState = constructorReducer(
      { ...initialState, ingredients: [mockedIngredient] },
      deleteIngredient('1')
    );
    expect(actualState.ingredients).toHaveLength(0);
  });

  it('при изменении порядка ингредиентов меняется поле ingredients', function () {
    const mockedIngredient1 = { ...mockedIngredients[1], id: '1' };
    const mockedIngredient2 = { ...mockedIngredients[2], id: '2' };

    const actualState = constructorReducer(
      {
        ...initialState,
        ingredients: [mockedIngredient1, mockedIngredient2]
      },
      moveIngredient({ from: '0', to: '1' })
    );
    expect(actualState.ingredients).toEqual([
      mockedIngredient2,
      mockedIngredient1
    ]);
  });
  it('конструктор очищается', function () {
    const actualState = constructorReducer(
      {
        bun: mockedIngredients[0],
        ingredients: [{ ...mockedIngredients[1], id: '1' }]
      },
      clearConstructor()
    );
    expect(actualState).toEqual(initialState);
  });
});
