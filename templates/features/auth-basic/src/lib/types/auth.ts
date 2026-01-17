export type AuthErrorKey =
  | "invalidCredentials"
  | "loginFailed"
  | "invalidRegistrationData"
  | "passwordMismatch"
  | "registrationFailed";

export type AuthActionState = {
  success: boolean;
  error: AuthErrorKey | null;
};
