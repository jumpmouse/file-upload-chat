import { Component, ViewChild } from '@angular/core';
import { PageTitleComponent } from '@shared/page-title/page-title.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { Subscription, Observable, Subject, map, debounceTime, skipWhile, distinctUntilChanged } from 'rxjs';
import { MagicLinkService } from '@services/magic-link.service';
import { MagicLinkList, MagicLinkListParams, MagicLinkListEntity, MagicLinkDetails, TransactionDetails } from '@types';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';

@Component({
  selector: 'flw-transactions',
  standalone: true,
  imports: [PageTitleComponent, TransactionsTableComponent, MatTabGroup, MatTab, TransactionDetailsComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  public selectedTab: number = 0;
  public selectedTransaction!: TransactionDetails;

  private filterObject: MagicLinkListParams = {
    'Sorting.OrderBy': 'DESC',
    'Sorting.FieldName': 'createdDate',
    listMode: 'Both',
    Take: 10,
    Skip: 0,
  };
  private _transactionsData$: Subject<MagicLinkList | null> = new Subject<MagicLinkList | null>();
  private filterInput$: Subject<string> = new Subject<string>();
  private subs: { [key: string]: Subscription } = {};

  get transactionsData$(): Observable<MagicLinkList | null> {
    return this._transactionsData$.asObservable();
  }

  constructor(private magicLinkService: MagicLinkService, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.updateTransactionsData(this.filterObject);
    this.subscribeToFilterInputChanges();
  }

  ngOnDestroy(): void {
    for (const key in this.subs) {
      if (this.subs.hasOwnProperty(key)) this.subs[key].unsubscribe();
    }
  }

  public setListMode(event: MatButtonToggleChange) {
    this.filterObject = this.updateFilterObject({ listMode: event.value });
    this.updateTransactionsData(this.filterObject);
  }

  public updatePagination(pagination: Partial<MagicLinkListParams>) {
    this.filterObject = this.updateFilterObject({ Skip: pagination.Skip });
    this.updateTransactionsData(this.filterObject);
  }

  public setSorting(sortingObject: Partial<MagicLinkListParams>) {
    this.filterObject = this.updateFilterObject(sortingObject);
    this.updateTransactionsData(this.filterObject);
  }

  public showDetails(transaction: MagicLinkListEntity) {
    this.selectedTransaction = transaction;
    this.selectedTab = 1;
  }

  public goToTransactions() {
    this.selectedTransaction = null;
    this.selectedTab = 0;
  }

  public setFilter(searchValue: string) {
    this.filterInput$.next(searchValue);
  }

  public downloadFile(params: {id: number, fileId: string}) {
    this.subs['downloadFile'] = this.magicLinkService.downloadFile(params).subscribe({
      next: (blob: any) => saveAs(blob, 'falconlink-files.zip'),
      error: (err) => console.log(err),
    });
  }

  public deleteFile(patientSharedStudyId: number) {
    this.magicLinkService.deleteFile(patientSharedStudyId).subscribe({
      next: () => {
        this.updateTransactionsData(this.filterObject);
        if (this.selectedTransaction) this.updateSelectedTransaction(this.selectedTransaction);

        const message = $localize`File successfully deleted.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });


      },
      error: () => {
        const message = $localize`File delete failed.`;
        this.snackbar.open(message, '', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  private updateFilterObject(filterObject: Partial<MagicLinkListParams>): MagicLinkListParams {
    let obj: MagicLinkListParams = { ...this.filterObject, Take: 10, Skip: 0 };
    const filtersArray = Object.entries(filterObject);
    for (let i = 0; i < filtersArray.length; i++) {
      const [key, value] = filtersArray[i];
      obj = { ...obj, [key]: value };
    }
    return obj;
  }

  private updateTransactionsData(params: MagicLinkListParams) {
    this.subs['transactionsData'] = this.getData(params).subscribe((val) => this._transactionsData$.next(val));
  }

  private updateSelectedTransaction(transaction: MagicLinkListEntity) {
    const patientSharedStudyId = transaction.id as number;
    this.subs['selectedTransaction'] = this.magicLinkService.getMagicLinkDetails(patientSharedStudyId).subscribe({
      next: (transactionDetails: MagicLinkDetails) => this.selectedTransaction = transactionDetails,
      error: (err) => console.log(err)
    });
  }

  private getData(params: MagicLinkListParams): Observable<MagicLinkList> {
    return this.magicLinkService.filterTransactionsData(params);
  }

  private subscribeToFilterInputChanges() {
    this.subs['filterInput'] = this.filterInput$.pipe(
      map((val: string) => (val.length > 2) ? val : ''),
      debounceTime(500),
      skipWhile(val => !val),
      distinctUntilChanged(),
    ).subscribe({
      next: (filterValue: string) => {
        this.filterObject = this.updateFilterObject({ Filter: filterValue });
        this.updateTransactionsData(this.filterObject);
      }
    });
  }
}
