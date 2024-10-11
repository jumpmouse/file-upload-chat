import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import {MagicLinkListEntity} from '@types';

/**
 * Data source for the RecentSentTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 */
export class RecentSentTableDataSource extends DataSource<MagicLinkListEntity> {
  data!: Observable<MagicLinkListEntity[]>;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<MagicLinkListEntity[]> {
    return this.data;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}
}
