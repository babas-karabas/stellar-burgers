import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredients-slice';
import { useParams, useSearchParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const params = useParams();
  const i = useSelector(getIngredients);
  const ingredientData = i.find((ingredient) => ingredient._id === params.id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
