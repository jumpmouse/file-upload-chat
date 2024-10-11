export interface ResetPasswordParams {
  email: string;
  emailCode: string;
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RegistrationParams {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}
