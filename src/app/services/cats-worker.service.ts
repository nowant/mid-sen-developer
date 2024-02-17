import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatUtils } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class CatsWorkerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public work(
    strategies: CatUtils[],
    params: unknown[] | object,
  ): Observable<any[]> {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const worker = new Worker(new URL('./cats.worker', import.meta.url));
    worker.postMessage({ strategies, params });

    return new Observable((observer) => {
      worker.onmessage = ({ data }) => {
        observer.next(data);
        observer.complete();
      };

      worker.onerror = (e) => {
        console.error(e);
        observer.error(e);
        observer.complete();
      };
    });
  }
}
