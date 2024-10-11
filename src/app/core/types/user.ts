export enum UserSubscriptionStatus {
  Active = 'Active',
  Expired = 'Expired',
  BillingRetry = 'BillingRetry',
  BillingGracePeriod = 'BillingGracePeriod',
  Revoked = 'Revoked',
}

export enum UserFeaturePermission {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete',
}

interface UserRole {
  id: number;
  name: string;
}

interface UserFeature {
  feature: string;
  permissions: UserFeaturePermission[];
}

interface UserWorkplace {
  id: number;
  address?: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  avatarId?: string;
  isDefault: boolean;
}

export interface UserData {
  email: string;
  createdDate: string;
  updatedDate?: string;
  lastLoginDate?: string;
  subscriptionStatus?: UserSubscriptionStatus;
  subscriptionExpiration?: string;
  emailVerified: boolean;
  role: UserRole;
  features: UserFeature[];
  status: string;
  id: number;
  title?: string;
  suffix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  profession?: string;
  addressCountry?: string;
  addressState?: string;
  addressCity?: string;
  addressZipCode?: string;
  addressLineOne?: string;
  addressLineTwo?: string;
  workplace?: string;
  workplaces?: UserWorkplace[];
  magicLink: string;
  isImportEnabled: boolean;
  showNotifyPatientsFromDownload: boolean;
  phoneNumber?: string;
  avatarId?: string;
}

export interface UserDevice {
  deviceId?: string;
  type?: string;
  model?: string;
  systemName?: string;
  systemVersion?: string;
  clientVersion?: string;
  pushNotificationId?: string;
  country?: string;
  city?: string;
  lat?: number;
  lon?: number;
  languageCode?: string;
}

export interface LoginParams {
  login: string;
  password: string;
  deviceId?: string;
  deviceType?: string;
  pushNotificationId?: string;
  originalTransactionId?: string;
  device?: UserDevice;
}

export interface LoginResponse {
  bearer: string;
  userId: number;
  role: {
    id: number;
    name: string;
  };
  permissions: UserFeature[];
}

export interface SaveProfileParams {
  title?: string;
  suffix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  profession?: string;
  addressCountry?: string;
  addressState?: string;
  addressCity?: string;
  addressZipCode?: string;
  addressLineOne?: string;
  addressLineTwo?: string;
  workplace?: string;
  phoneNumber?: string;
}
