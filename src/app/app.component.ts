import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Select, Store } from '@ngxs/store';
import { CatsTableComponent } from './components/cats-table/cats-table.component';
import {
  ClearFilterCats,
  CreateCats,
  FilterByCategoryCats,
  FilterByPriceRangeCats,
  PaginateCats,
} from './states/cats.actions';
import { CatsState } from './states/cats.state';
import { Cat, CatsFilter, CatsPagination } from './states/cats.model';
import { CatsPriceRangeComponent } from './components/cats-price-range/cats-price-range.component';
import { CatsSelectComponent } from './components/cats-select/cats-select.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    CatsTableComponent,
    CatsPriceRangeComponent,
    CatsSelectComponent,
  ],
})
export class AppComponent implements OnInit {
  @Select(CatsState.cats)
  public cats$!: Observable<Cat[]>;

  @Select(CatsState.isLoading)
  public isLoading$!: Observable<boolean>;

  @Select(CatsState.pagination)
  public pagination$!: Observable<CatsPagination>;

  @Select(CatsState.range)
  public range$!: Observable<Pick<CatsFilter, 'priceMin' | 'priceMax'>>;

  @Select(CatsState.hasFilters)
  public hasFilters$!: Observable<boolean>;

  @Select(CatsState.category)
  public category$!: Observable<string>;

  constructor(private _store: Store) {}

  public ngOnInit(): void {
    this._store.dispatch(new CreateCats()).subscribe();
  }

  public onPaginateCats(pagination: PageEvent): void {
    const page = pagination.pageIndex;
    const perPage = pagination.pageSize;
    this._store.dispatch(new PaginateCats({ page, perPage })).subscribe();
  }

  public onFilterByPriceCats(
    priceRange: Pick<CatsFilter, 'priceMin' | 'priceMax'>,
  ) {
    this._store.dispatch(new FilterByPriceRangeCats(priceRange)).subscribe();
  }

  public onFilterByCategoryCats(category: string) {
    this._store.dispatch(new FilterByCategoryCats(category)).subscribe();
  }

  public onClearFilterCats() {
    this._store.dispatch(new ClearFilterCats()).subscribe();
  }
}
