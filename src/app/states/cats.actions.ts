import { CatsFilter, CatsPagination } from './cats.model';

export class CreateCats {
  static readonly type = '[Cats] Create';
}

export class PaginateCats {
  static readonly type = '[Cats] Paginate';
  constructor(public payload: Pick<CatsPagination, 'page' | 'perPage'>) {}
}

export class FilterByPriceRangeCats {
  static readonly type = '[Cats] Filter By Price Range';
  constructor(public payload: Pick<CatsFilter, 'priceMin' | 'priceMax'>) {}
}

export class FilterByCategoryCats {
  static readonly type = '[Cats] Filter By Category';
  constructor(public payload: string) {}
}

export class ClearFilterCats {
  static readonly type = '[Cats] Clear';
}
