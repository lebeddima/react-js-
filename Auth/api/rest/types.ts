// login
export type TLoginReq = {
  email: string
  password: string
}

// register
export type TSignUpReq = {
  firstName: string
  lastName: string
  email: string
  password: string
  terms: boolean
}

// otp
export enum EVerificationType {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_CHANGE = 'password_change',
}

// forgot pass
export type TForgotEmailReq = {
  email: string
}

export type TForgotCodeReq = {
  code: string
} & TForgotEmailReq

export type TForgotPass = {
  password: string
  passwordConfirmation: string
}

export type TForgotPassReq = TForgotPass & TForgotCodeReq
