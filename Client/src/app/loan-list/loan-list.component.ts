import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { Loan } from '../model/loan';
import { Book } from '../model/book';
import { LoanService } from '../services/loan.service';
import { UserService } from '../services/user.service';
import { BookService } from '../services/book.service';
import { CopyService } from '../services/copy.service';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {

  public loans$: Observable<Loan[]>;
  constructor(private loanService: LoanService,
              private userService: UserService,
              private bookService: BookService,
              private copyService: CopyService,
              private router: Router) { }

  ngOnInit(): void {
    this.init();
  }

  public init() {
    this.loans$ = this.loanService.getAll()
    .pipe(
      tap(this.preciseName.bind(this))
    );
  }

  public preciseName(loans: Loan[]){
    this.chUserName(loans);
    this.chBookName(loans);
  }
  public chUserName(loans: Loan[]){
    for (const loan of loans) {
      this.userService.getById(loan.userId)
       .pipe(
         map(user => loan.userName = user.name)
       )
       .subscribe();
    }
  }

  public chBookName(loans: Loan[]){
    const books = this.bookService.getAll()
      .pipe(
        tap(books=> books.forEach(book =>{
          this.copyService.getAll(book.id)
           .pipe(
             map(copies => book.copies = copies)
           )
           .subscribe();
          })
        )
      )
      .pipe(
        map(books=> books.forEach(book => {
          for(const loan of loans){
            let copy;
            if(copy=_.find(book.copies,{id:loan.copyId}))
              loan.bookName = book.name
            }
          })
        )
      )
      .subscribe();
  }

  public return(loanId){
    this.loanService.return(loanId)
      .pipe(
        tap(() => this.ngOnInit())
      )
      .subscribe();
  }
}
