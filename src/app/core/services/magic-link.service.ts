import { Injectable } from '@angular/core';
import {
  MagicLinkDetails,
  MagicLinkInfo,
  MagicLinkLimit,
  MagicLinkList,
  MagicLinkListParams,
  SenderDetails,
  SenderDetailsOTP,
} from '@types';
import { MagicLinkDataService } from './data/magic-link-data.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MagicLinkService {
  constructor(private magicLinkDataService: MagicLinkDataService) {}

  public getDoctorInfo(magicLink: string): Observable<MagicLinkInfo> {
    return this.magicLinkDataService.getDoctorInfo(magicLink);
  }

  public getRecentlySentData(): Observable<MagicLinkList> {
    const magicLinkListParams: MagicLinkListParams = {
      'Sorting.OrderBy': 'DESC',
      'Sorting.FieldName': 'createdDate',
      Take: 3,
      listMode: 'Sent',
    };
    return this.magicLinkDataService.getMagicLinkList(magicLinkListParams);
  }

  public filterTransactionsData(params: MagicLinkListParams): Observable<MagicLinkList> {
    return this.magicLinkDataService.getMagicLinkFilterList(params);
  }

  public sendVerificationCode(email: string): Observable<any> {
    return this.magicLinkDataService.sendVerificationCode(email);
  }

  public verifyEmailCode(email: string, code: string): Observable<any> {
    return this.magicLinkDataService.verifyEmailCode(email, code);
  }

  public uploadFiles(senderDetails: SenderDetails | SenderDetailsOTP): Observable<any> {
    return this.magicLinkDataService.uploadFiles(senderDetails);
  }

  public getMagicLinkLimit(): Observable<MagicLinkLimit> {
    return this.magicLinkDataService.getMagicLinkLimit();
  }

  public getMagicLinkDetails(patientSharedStudyId: number): Observable<MagicLinkDetails> {
    return this.magicLinkDataService.getMagicLinkDetails(patientSharedStudyId);
  }

  public downloadFile({id, fileId}: {id: number, fileId: string}): Observable<any> {
    const patientSharedStudyId = id;
    return this.magicLinkDataService.downloadFile(fileId)
    .pipe(
      tap(() => {
        return this.magicLinkDataService.markFileForDownload(patientSharedStudyId).subscribe();
      }),
    );
  }

  public deleteFile(patientSharedStudyId: number): Observable<any> {
    return this.magicLinkDataService.deleteFile(patientSharedStudyId);
  }
}
