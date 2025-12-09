import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store/store';
import { getIngredients } from '../../services/slices/ingredients-slice';
import { useParams, useSearchParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const ingredientData = useSelector(getIngredients).find(
    (ingredient) => ingredient._id === params.id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
