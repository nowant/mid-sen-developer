import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable, filter, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Select } from '@ngxs/store';
import { CatsWorkerService } from 'src/app/services/cats-worker.service';
import { CatUtils } from 'src/app/utils';
import { Cat } from 'src/app/states/cats.model';
import { CatsState } from 'src/app/states/cats.state';

@Component({
  standalone: true,
  selector: 'app-cats-select',
  template: `
    <mat-form-field>
      <mat-label>Choose a category</mat-label>
      <mat-select
        [disabled]="options.length < 1"
        [value]="option"
        (selectionChange)="onChange($event)"
      >
        <mat-option
          *ngFor="let option of options"
          [value]="option"
        >
          {{option}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styleUrls: ['./cats-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, MatInputModule, MatSelectModule, MatFormFieldModule],
})
export class CatsSelectComponent implements OnInit {
  @Input()
  public option: string | null = '';

  @Select(CatsState.allCats)
  public cats$!: Observable<Cat[]>;

  @Output()
  public selected = new EventEmitter<string>();

  public options: string[] = [];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _catsWorkerService: CatsWorkerService,
  ) {}

  public ngOnInit(): void {
    this.cats$
      .pipe(
        filter((cats) => cats.length > 0),
        take(1)
      )
      .subscribe((cats: Cat[]) => {
        this._catsWorkerService
          .work(CatUtils.FilterCategories, [cats])
          .subscribe((categories: string[]) => {
            this.options = categories;
            this._changeDetectorRef.detectChanges();
          })
        });
  }

  public onChange(option: { value: string }) {
    this.selected.emit(option.value);
  }
}
