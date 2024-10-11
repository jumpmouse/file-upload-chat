export interface MagicLinkInfo {
  doctorName: string;
  uploadLimitInKb: number;
}

export interface MagicLinkListUser {
  id?: number;
  avatarId?: string;
  title?: string;
  suffix?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  magicLink?: string;
}

export interface MagicLinkListEntity {
  id?: number;
  sizeInKb?: number;
  email?: string;
  phoneNumber?: string;
  patientName?: string;
  message?: string;
  bodyPart?: string;
  isSharingOwnData?: true;
  createdDate?: string;
  updatedDate?: string;
  deletedDate?: string;
  downloadDate?: string;
  expireDate?: string;
  patientShareId?: string;
  hasBeenRead?: true;
  numberOfFiles?: number;
  numberOfValidFiles?: number;
  chatMessageGroupId?: number;
  receiverUser?: MagicLinkListUser;
  senderUser?: MagicLinkListUser;
  deletedBy?: MagicLinkListUser;
  unreadMessageCount?: number;
  sentReceived?: string;
  callerUserId?: number;
  fileId?: string;
}

export interface MagicLinkList {
  entities: MagicLinkListEntity[];
  count: number;
  totalCount: number;
}

export interface MagicLinkLimit {
  limitInKb: number;
  usedDataInKb: number;
}

export interface MagicLinkListFilter {
  type?: string;
  fieldName?: string;
  value?: string;
  isMultiSet?: boolean;
}

export interface MagicLinkListParams {
  Filter?: string;
  'Sorting.OrderBy'?: 'ASC' | 'DESC';
  'Sorting.FieldName'?: string;
  Skip?: number;
  Take?: number;
  IsAnd?: boolean;
  listMode?: 'Sent' | 'Received' | 'Both';
}

export interface SenderDetailsForm {
  PatientName?: string;
  Email: string;
  PhoneNumber?: string;
  Message?: string;
  files: File[];
  OTP?: string;
}

export interface SenderDetails {
  MagicLink: string;
  Email: string;
  PhoneNumber?: string;
  PatientName?: string;
  BodyPart?: string;
  IsSharingOwnData?: boolean;
  Message?: string;
  LanguageCode?: string;
  NumberOfFiles: number;
  files: File;
}

export type SenderDetailsOTP = SenderDetails & { OTP: string };

export interface SharedFile {
  id: string;
  name: string;
  extension: string;
  sizeKb: number;
  path: string;
}

export interface sharedStudyItemFile {
  id: string;
  name: string;
  extension: string;
  sizeKb: number;
  path: string;
}

export interface MagicLinkStudy {
  studyInstanceUid: string;
  patientId: string;
  studyId: string;
  studyName: string;
  patientName: string;
  institutionName: string;
  referringPhysicianName: string;
  modality: string;
  accessionNumber: string;
  specificCharacterSet: string;
  studyDate: string;
  studyTime: string;
  instanceAvailability: number;
  timezoneOffsetFromUtc: string;
  patientBirthDate: string;
  patientSex: string;
  sharedStudyItemFiles: sharedStudyItemFile[];
}

export type MagicLinkDetails = MagicLinkListEntity & {
  sharedFiles: SharedFile[];
  studies: MagicLinkStudy[];
}

export type TransactionDetails = MagicLinkListEntity | MagicLinkDetails | null;
