import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpMethod, DataUtilsService } from './utils';
import {
  MagicLinkDetails,
  MagicLinkInfo,
  MagicLinkList,
  MagicLinkListFilter,
  SenderDetails,
  SenderDetailsOTP,
  MagicLinkListParams,
  MagicLinkLimit
} from '@types';

@Injectable({
  providedIn: 'root',
})
export class MagicLinkDataService {
  constructor(private http: HttpClient, private dataUtils: DataUtilsService) {}

  public getDoctorInfo(magicLink: string): Observable<MagicLinkInfo> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'magicLinkInfo', magicLink);
    return this.http.get<MagicLinkInfo>(url, this.dataUtils.getHttpOptions());
  }

  public getMagicLinkList(magicLinkListParams: MagicLinkListParams): Observable<MagicLinkList> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'magicLinkList');
    return this.http.get<MagicLinkList>(url, this.dataUtils.getHttpOptions(magicLinkListParams));
  }

  public getMagicLinkLimit(): Observable<MagicLinkLimit> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'magicLinkLimit');
    return this.http.get<MagicLinkLimit>(url, this.dataUtils.getHttpOptions());
  }

  public getMagicLinkFilterList(magicLinkListParams: MagicLinkListParams): Observable<MagicLinkList> {
    const encodedQueryParams = this.prepareQueryParams(magicLinkListParams);
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'magicLinkListWithParams', encodedQueryParams);
    return this.http.get<MagicLinkList>(url, this.dataUtils.getHttpOptions());
  }

  public sendVerificationCode(email: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'sendVerificationCode');
    return this.http.post(url, { email }, this.dataUtils.getHttpOptions());
  }

  public verifyEmailCode(email: string, code: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'verifyEmailCode');
    return this.http.post(url, { email, code }, this.dataUtils.getHttpOptions());
  }

  public uploadFiles(senderDetails: SenderDetails | SenderDetailsOTP): Observable<any> {
    const endpointName = (senderDetails as SenderDetailsOTP).OTP ? 'uploadFileOtp' : 'uploadFile';
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, endpointName);
    // convert request obj from json to formData
    const formData = new FormData();
    const senderDetailsArray = Object.entries(senderDetails);
    for (let i = 0; i < senderDetailsArray.length; i++) {
      const param = senderDetailsArray[i];
      formData.append(param[0], param[1]);
    }
    return this.http.post(url, formData, {
      ...this.dataUtils.getHttpOptions(),
      reportProgress: true,
      observe: 'events',
    });
  }

  public getMagicLinkDetails(patientSharedStudyId: number): Observable<MagicLinkDetails> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'magicLinkDetails', patientSharedStudyId);
    return this.http.get<MagicLinkDetails>(url, this.dataUtils.getHttpOptions());
  }

  public markFileForDownload(patientSharedStudyId: number): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.POST, 'markFileForDownload', patientSharedStudyId);
    return this.http.post(url, {}, this.dataUtils.getHttpOptions());
  }

  public downloadFile(fileId: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.GET, 'downloadFile', fileId);
    return this.http.get(url, {...this.dataUtils.getHttpOptions(null, {}, {responseType: 'blob'})});
  }

  public deleteTransaction(patientShareId: string): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.DELETE, 'deleteTransaction', patientShareId);
    return this.http.delete(url, this.dataUtils.getHttpOptions());
  }

  public deleteFile(patientSharedStudyId: number): Observable<any> {
    const url = this.dataUtils.getEndpointUrl(HttpMethod.DELETE, 'deleteFile', patientSharedStudyId);
    return this.http.delete(url, this.dataUtils.getHttpOptions());
  }


  private prepareQueryParams(params: MagicLinkListParams): string {
    const filterEncodedString = this.encodeFilters(params.Filter);
    delete params.Filter;
    return `${this.encodeQueryParams(params)}${filterEncodedString}`;
  }

  private encodeFilters(filterValue?: string): string {
    if (!filterValue) return '';
    
    const nameFilterObject = this.getFilterObject(filterValue, 'correspondentName');
    const emailFilterObject = this.getFilterObject(filterValue, 'correspondentEmail');
    const nameFilterString = this.encodeQueryParams(nameFilterObject);
    const emailFilterString = this.encodeQueryParams(emailFilterObject);
    const nameFilterEncoded = encodeURIComponent(nameFilterString);
    const emailFilterEncoded = encodeURIComponent(emailFilterString);
    return `&filter=${nameFilterEncoded}&filter=${emailFilterEncoded}`;
  }

  private encodeQueryParams(params: MagicLinkListParams | MagicLinkListFilter): string {
    let preparedParam = '';
    const paramsArray = Object.entries(params);
    for (let i = 0; i < paramsArray.length; i++) {
      const [key, value] = paramsArray[i];
      // encode filter param value to base64
      // NOTE: MagicLinkListFilter has 'value' param, while MagicLinkListParams do not, no need for additional check
      const preparedValue = (key === 'value') ? btoa(value) : value;
      preparedParam += `${key}=${preparedValue}`;
      if (i < paramsArray.length - 1) {
        preparedParam += '&';
      }
    }
    return preparedParam;
  }

  private getFilterObject(value: string, fieldName: string): MagicLinkListFilter {
    return {
      fieldName,
      value,
      type: 'Contains',
      isMultiSet: false,
    };
  }
}
