import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import {
  Cat,
  CatsFilter,
  CatsPagination,
  CatsStateModel,
  initialCatsFilterState,
} from './cats.model';
import { CatsWorkerService } from '../services/cats-worker.service';
import {
  ClearFilterCats,
  CreateCats,
  FilterByCategoryCats,
  FilterByPriceRangeCats,
  PaginateCats,
} from './cats.actions';
import { CatUtils } from '../utils';

@State<CatsStateModel>({
  name: 'cats',
  defaults: {
    isLoading: false,
    filter: {
      ...initialCatsFilterState,
    },
    entities: [],
    entitiesOutput: [],
  },
})
@Injectable()
export class CatsState {
  @Selector()
  static allCats(state: CatsStateModel): Cat[] {
    return state.entities;
  }

  @Selector()
  static cats(state: CatsStateModel): Cat[] {
    const { page, perPage } = state.filter;
    const start = page * perPage;
    const end = start + perPage;
    return state.entitiesOutput.slice(start, end);
  }

  @Selector()
  static isLoading(state: CatsStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static pagination(state: CatsStateModel): CatsPagination {
    return {
      page: state.filter.page,
      perPage: state.filter.perPage,
      perPageSizes: state.filter.perPageSizes,
      total: state.filter.total,
    };
  }

  @Selector()
  static range(
    state: CatsStateModel,
  ): Pick<CatsFilter, 'priceMin' | 'priceMax'> {
    return {
      priceMin: state.filter.priceMin,
      priceMax: state.filter.priceMax,
    };
  }

  @Selector()
  static hasFilters(state: CatsStateModel): boolean {
    return state.filter.actions.length > 0;
  }

  @Selector()
  static category(state: CatsStateModel): string {
    return state.filter.category;
  }

  constructor(private _catsWorkerService: CatsWorkerService) {}

  @Action(CreateCats)
  public create(ctx: StateContext<CatsStateModel>) {
    const state: CatsStateModel = ctx.getState();

    ctx.patchState({ isLoading: true });

    return this._catsWorkerService
      .work(CatUtils.Create, [state.filter.total])
      .pipe(
        tap((cats: Cat[]) => {
          ctx.patchState({
            isLoading: false,
            entities: cats,
            entitiesOutput: cats,
          });
        }),
        catchError((e) => {
          ctx.patchState({ isLoading: false });
          return of(e);
        }),
      );
  }

  @Action(PaginateCats)
  public paginate(ctx: StateContext<CatsStateModel>, action: PaginateCats) {
    const state: CatsStateModel = ctx.getState();

    return ctx.patchState({
      filter: {
        ...state.filter,
        ...action.payload,
      },
    });
  }

  @Action(FilterByPriceRangeCats)
  public filterByRange(
    ctx: StateContext<CatsStateModel>,
    action: FilterByPriceRangeCats,
  ) {
    const state: CatsStateModel = ctx.getState();

    const filter = {
      ...action.payload,
      actions: [...state.filter.actions],
    };

    this._appendFilterAction(filter.actions, CatUtils.FilterByRange);

    ctx.patchState({
      isLoading: true,
      filter: {
        ...state.filter,
        ...filter,
      },
    });

    const entities = this._getEntitiesByPrimaryFilterAction(
      ctx,
      CatUtils.FilterByRange,
    );

    return this._catsWorkerService
      .work(CatUtils.FilterByRange, [
        entities,
        action.payload.priceMin,
        action.payload.priceMax,
      ])
      .pipe(
        tap((cats: Cat[]) => {
          this._updateWithInitialPagination(ctx, cats);
        }),
        catchError((e) => {
          ctx.patchState({ isLoading: false });
          return of(e);
        }),
      );
  }

  @Action(FilterByCategoryCats)
  public filterByCategory(
    ctx: StateContext<CatsStateModel>,
    action: FilterByCategoryCats,
  ) {
    const state: CatsStateModel = ctx.getState();

    const filter = {
      category: action.payload,
      actions: [...state.filter.actions],
    };

    this._appendFilterAction(filter.actions, CatUtils.FilterByCategory);

    ctx.patchState({
      isLoading: true,
      filter: {
        ...state.filter,
        ...filter,
      },
    });

    const entities = this._getEntitiesByPrimaryFilterAction(
      ctx,
      CatUtils.FilterByCategory,
    );

    return this._catsWorkerService
      .work(CatUtils.FilterByCategory, [entities, action.payload])
      .pipe(
        tap((cats: Cat[]) => {
          this._updateWithInitialPagination(ctx, cats);
        }),
        catchError((e) => {
          ctx.patchState({ isLoading: false });
          return of(e);
        }),
      );
  }

  @Action(ClearFilterCats)
  public clear(ctx: StateContext<CatsStateModel>) {
    const state: CatsStateModel = ctx.getState();

    ctx.patchState({
      isLoading: false,
      filter: { ...initialCatsFilterState },
      entitiesOutput: state.entities,
    });
  }

  private _updateWithInitialPagination(
    ctx: StateContext<CatsStateModel>,
    cats: Cat[],
  ) {
    return ctx.patchState({
      filter: {
        ...ctx.getState().filter,
        page: 0,
        total: cats.length,
      },
      isLoading: false,
      entitiesOutput: cats,
    });
  }

  private _appendFilterAction(actions: CatUtils[], action: CatUtils): void {
    if (actions.indexOf(action) === -1) {
      actions.push(action);
    }
  }

  private _getEntitiesByPrimaryFilterAction(
    ctx: StateContext<CatsStateModel>,
    action: CatUtils,
  ): Cat[] {
    const state: CatsStateModel = ctx.getState();
    const isPrimary: boolean = state.filter.actions.indexOf(action) < 1;
    return isPrimary ? state.entities : state.entitiesOutput;
  }
}
