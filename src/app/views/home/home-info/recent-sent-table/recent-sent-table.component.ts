import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RecentSentTableDataSource } from './recent-sent-table-datasource';
import { CardComponent } from '@shared/card/card.component';
import { map, Observable } from 'rxjs';
import { MagicLinkList, MagicLinkListEntity } from '@types';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '@shared/button/button.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'flw-recent-sent-table',
  templateUrl: './recent-sent-table.component.html',
  styleUrl: './recent-sent-table.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CardComponent, DatePipe, ButtonComponent, MatTooltip],
})
export class RecentSentTableComponent implements OnInit, AfterViewInit {
  @Input() data!: Observable<MagicLinkList | null>;
  @Output() recentMagicLink: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatTable) table!: MatTable<MagicLinkListEntity>;
  dataSource = new RecentSentTableDataSource();

  displayedColumns = ['date', 'name', 'actions'];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.data = this.data.pipe(map((data) => (data?.entities.length ? data?.entities : [])));
    this.table.dataSource = this.dataSource;
  }

  public sendFiles(magicLink: string) {
    this.recentMagicLink.emit(magicLink);
  }
}
