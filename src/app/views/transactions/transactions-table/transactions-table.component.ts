import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { TransactionsTableDataSource } from './transactions-table-datasource';
import { CardComponent } from '@shared/card/card.component';
import { map, Observable } from 'rxjs';
import { MagicLinkList, MagicLinkListEntity, MagicLinkListParams } from '@types';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '@shared/button/button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FileSizePipe } from '@pipes/file-size.pipe';
import {MatMenu, MatMenuTrigger, MatMenuItem} from '@angular/material/menu';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField } from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { ConfirmDeleteFileComponent } from '../confirm-delete-file/confirm-delete-file.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'flw-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CardComponent,
    DatePipe,
    ButtonComponent,
    MatTooltip,
    MatIcon,
    FileSizePipe,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTooltip,
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ],
})
export class TransactionsTableComponent implements OnInit, AfterViewInit {
  @Input() data!: Observable<MagicLinkList | null>;
  @Output() goToDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateListMode: EventEmitter<MatButtonToggleChange> = new EventEmitter<MatButtonToggleChange>();
  @Output() updatePagination: EventEmitter<Partial<MagicLinkListParams>> = 
    new EventEmitter<Partial<MagicLinkListParams>>();
  @Output() updateSorting: EventEmitter<Partial<MagicLinkListParams>> = new EventEmitter<Partial<MagicLinkListParams>>();
  @Output() updateFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() downloadFile: EventEmitter<{id: number, fileId: string}> = new EventEmitter<{id: number, fileId: string}>();
  @Output() deleteFile: EventEmitter<number> = new EventEmitter<number>();
  
  @ViewChild(MatTable) table!: MatTable<MagicLinkListEntity>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterTransactionsControl: FormControl<string | null> = new FormControl<string | null>(null);

  pageSize: number = 0;
  length: number = 0;

  dataSource = new TransactionsTableDataSource();

  displayedColumns = ['date', 'type', 'name', 'deletedDate', 'size', 'actions'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.data = this.data.pipe(
      map((data) => {
        if (!this.pageSize) this.pageSize = data?.count || 0;
        this.length = data?.totalCount || 0;
        return data?.entities.length ? data?.entities : [];
      })
    );
    this.table.dataSource = this.dataSource;
  }

  public downloadFiles(id: number, fileId: string) {
    this.downloadFile.emit({id, fileId});
  }

  public revokeAccess(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteFileComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.deleteFile.emit(id);
    });
  }

  public showDetails(row: any) {
    this.goToDetails.emit(row);
  }

  public setListMode(event: MatButtonToggleChange) {
    this.updateListMode.emit(event);
    this.resetPaginator();
  }

  public setSorting(val: Sort) {
    const sortingParams: Partial<MagicLinkListParams> = {
      'Sorting.OrderBy': (val.direction.toUpperCase() as 'ASC' | 'DESC'),
      'Sorting.FieldName': val.active,
    };
    this.updateSorting.emit(sortingParams);
    this.resetPaginator();
  }

  public paginate(pagination: PageEvent) {
    const paginationParams: Partial<MagicLinkListParams> = {
      Skip: pagination.pageSize * pagination.pageIndex,
    };
    this.updatePagination.emit(paginationParams);
  }

  public filterTransactions() {
    this.updateFilter.emit(this.filterTransactionsControl.value || '');
  }

  private resetPaginator() {
    this.paginator.pageIndex = 0;
  }
}
