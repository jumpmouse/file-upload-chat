interface Endpoint {
  [key: string]: (...args: string[]) => string;
}

interface Endpoints {
  get: Endpoint;
  post: Endpoint;
  put: Endpoint;
  delete: Endpoint;
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}

// list of all endpoints used in the app
export const EndpointList: Endpoints = {
  get: {
    // USER
    userData: (userId: string) => `user/${userId}`,
    // MAGIC LINK
    magicLinkInfo: (magicLink: string) => `magiclink/${magicLink}/info`,
    magicLinkList: () => `magiclink/list`,
    magicLinkLimit: () => `magiclink/limit`,
    magicLinkListWithParams: (queryParams: string) => `magiclink/list?${queryParams}`,
    magicLinkDetails: (patientSharedStudyId: string) => `magiclink/${patientSharedStudyId}`,
    // FILES
    downloadFile: (fileId: string) => `files/${fileId}/download`,
  },
  post: {
    // AUTHENTICATION
    login: () => `authentication/login`,
    logout: () => `authentication/logout`,
    // USER SECURITY
    verifyPasswordConfirmationCode: () => `users/verify-password-confirmation-code`,
    updatePassword: (userId: string) => `users/${userId}/change-password`,
    verifyEmailConfirmationCode: () => `users/verify-email-confirmation-code`,
    sendResetPasswordCode: () =>`users/send-reset-password-confirmation-code`,
    resetPassword: () => `users/reset-password`,
    // REGISTRATION
    registerUser: () => `registration/registertohorosmd`,
    // VERIFICATION
    sendEmailCode: () => `verifications/send-email-code`,
    verifyEmailCode: () => `verifications/verify-email-code`,
    // MAGIC LINK
    sendVerificationCode: () => `magiclink/send-verification-code`,
    uploadFile: () => `magiclink/upload-auth`,
    uploadFileOtp: () => `magiclink/upload-otp`,
    markFileForDownload: (patientSharedStudyId: string) => `magiclink/${patientSharedStudyId}/download`,
  },
  put: {
    // USER PROFILE
    saveProfile: (userId: string) => `user/${userId}`,
  },
  delete: {
    deleteUser:  (userId: string) => `user/${userId}`,
    deleteTransaction: (patientShareId: string) => `magiclink/${patientShareId}`,
    deleteFile: (patientSharedStudyId: string) => `magiclink/${patientSharedStudyId}`,
  }
};
