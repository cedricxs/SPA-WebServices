import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { BaseHttpService } from './baseHttpService';
import { Loan } from '../model/loan';

@Injectable()
export class LoanService extends BaseHttpService {
  loan(copyId, userId): Observable<void> {
    return this.http.post(`${this.baseUrl}/loans`,{copyId:copyId,userId:userId,loanDate:"1997/01/01"})
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }

  public getAll(): Observable<Loan[]> {
    return this.http
    .get<Loan[]>(`${this.baseUrl}/loans`);
  }

  public return(loanId): Observable<void> {
    return this.http.delete(`${this.baseUrl}/loans/${loanId}`)
      .pipe(
        map(() => null),
        catchError((err) => { console.log(err); return null; })
      );
  }
}
