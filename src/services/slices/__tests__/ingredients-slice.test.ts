import { TIngredientsState, ingredientsReducer } from '../ingredients-slice';
import { loadIngredients } from '../../actions/load-ingredients';

describe('ingredientsSlice', function () {
  const initialState: TIngredientsState = {
    data: [],
    loading: false,
    error: undefined
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

  it('загруженные ингредиенты сохранены в стор корректно', function () {
    const expectedState: TIngredientsState = {
      ...initialState,
      data: mockedIngredients
    };

    const actualState = ingredientsReducer(
      { ...initialState, loading: true },
      loadIngredients.fulfilled(mockedIngredients, '')
    );

    expect(actualState).toEqual(expectedState);
  });

  it('при загрузке ингредиентов меняется поле loading', function () {
    const expectedState: TIngredientsState = {
      ...initialState,
      loading: true,
      error: ''
    };

    const actualState = ingredientsReducer(
      { ...initialState, error: 'test error' },
      loadIngredients.pending('')
    );
    expect(actualState).toEqual(expectedState);
  });

  it('при ошибке загрузки ингредиентов меняется поле error', function () {
    const error = new Error('test error');
    const expectedState: TIngredientsState = {
      ...initialState,
      error: error.message
    };

    const actualState = ingredientsReducer(
      initialState,
      loadIngredients.rejected(error, '')
    );
    expect(actualState).toEqual(expectedState);
  });
});
