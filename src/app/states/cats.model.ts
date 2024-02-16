import { CatUtils } from '../utils';

export interface Cat {
  id: string;
  avatar: string;
  name: string;
  category: string;
  price: number;
}

export interface CatsPagination {
  page: number;
  perPage: number;
  perPageSizes: number[];
  total: number;
}

export interface CatsFilter extends CatsPagination {
  actions: CatUtils[];
  category: string;
  priceMin: number;
  priceMax: number;
}

export interface CatsStateModel {
  isLoading: boolean;
  filter: CatsFilter;
  entities: Cat[];
  entitiesOutput: Cat[];
}

export const initialCatsFilterState: CatsFilter = {
  actions: [],
  page: 0,
  perPage: 20,
  perPageSizes: [20, 40, 60, 100],
  total: 1000,
  category: '',
  priceMin: 10,
  priceMax: 500,
};
