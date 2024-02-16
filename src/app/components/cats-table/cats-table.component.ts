import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cat, CatsPagination } from 'src/app/states/cats.model';

@Component({
  standalone: true,
  selector: 'app-cats-table',
  templateUrl: './cats-table.component.html',
  styleUrls: ['./cats-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    CurrencyPipe,
  ],
})
export class CatsTableComponent {
  @Input()
  public cats: Cat[] | null = [];

  @Input()
  public isLoading: boolean | null = false;

  @Input()
  public pagination!: CatsPagination | null;

  @Output()
  public paginated = new EventEmitter<PageEvent>();

  public columns: string[] = ['avatar', 'name', 'category', 'price'];

  public onPaginate(event: PageEvent): void {
    this.paginated.emit(event);
  }
}
