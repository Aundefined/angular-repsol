import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {
  private subject = new Subject<any>();

  constructor() {
  }

  showLoading(show: boolean) {
    this.subject.next({ showLoading: show});
  }

  getLoading(): Observable<any> {
    return this.subject.asObservable();
  }
}
