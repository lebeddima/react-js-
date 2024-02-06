import { api } from '@/api-rest/instance'
import { TAxiosResponse } from '@/types/axios'
import { TForgotCodeReq, TForgotEmailReq, TForgotPassReq } from './types'

const validateEmail = (data: TForgotEmailReq): TAxiosResponse<unknown> =>
  api.post('auth/recovery-password/validate-email', data)

const getCode = (data: TForgotEmailReq): TAxiosResponse<unknown> =>
  api.post('auth/recovery-password/send', data)

const sendCode = (data: TForgotCodeReq): TAxiosResponse<unknown> =>
  api.post('auth/recovery-password/validate', data)

const sendPassword = (data: TForgotPassReq): TAxiosResponse<unknown> =>
  api.post('auth/recovery-password/reset', data)

export const apiFotgotPass = {
  validateEmail,
  getCode,
  sendCode,
  sendPassword,
}
