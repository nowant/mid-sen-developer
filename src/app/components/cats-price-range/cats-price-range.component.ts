import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CatsFilter } from 'src/app/states/cats.model';

@Component({
  standalone: true,
  selector: 'app-cats-price-range',
  template: `
    <div *ngIf="range" class="cats-range">
      <mat-form-field class="cats-rage__field">
        <mat-label>Min price</mat-label>
        <input
          type="number"
          min="10"
          matInput
          [(ngModel)]="range.priceMin"
          (change)="onChange()"
        >
      </mat-form-field>
      <mat-form-field class="cats-rage__field">
        <mat-label>Max price</mat-label>
        <input
          type="number"
          max="500"
          matInput
          [(ngModel)]="range.priceMax"
          (change)="onChange()"
        >
      </mat-form-field>
  </div>
  `,
  styleUrls: ['./cats-price-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatFormFieldModule, MatInputModule, FormsModule],
})
export class CatsPriceRangeComponent {
  @Input()
  public range!: Pick<CatsFilter, 'priceMin' | 'priceMax'> | null;

  @Output()
  public changed = new EventEmitter<
    Pick<CatsFilter, 'priceMin' | 'priceMax'>
  >();

  public onChange() {
    this.changed.emit(this.range as Pick<CatsFilter, 'priceMin' | 'priceMax'>);
  }
}
