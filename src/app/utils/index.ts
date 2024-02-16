import { useToCreateCats } from './create-cats.util';
import {
  useToFilterByCategoryCats,
  useToFilterByPriceRangeCats,
  useToFilterCatCategories,
} from './filter-cats.util';

export enum CatUtils {
  Create,
  FilterByRange,
  FilterCategories,
  FilterByCategory,
}

export const catUtils: {
  [key in CatUtils]: (...args: never[]) => unknown[];
} = {
  [CatUtils.Create]: useToCreateCats,
  [CatUtils.FilterByRange]: useToFilterByPriceRangeCats,
  [CatUtils.FilterCategories]: useToFilterCatCategories,
  [CatUtils.FilterByCategory]: useToFilterByCategoryCats,
};
