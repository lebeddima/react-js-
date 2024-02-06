import { api } from '@/api-rest/instance'
import { TAxiosResponse } from '@/api-rest/types'
import { EVerificationType } from './types'

export type TGetCodeReq = {
  type: EVerificationType
}

export type TSendCodeReq = {
  type: EVerificationType
  code: string
}

const sendCode = (data: TSendCodeReq): TAxiosResponse<unknown> =>
  api.patch('/code', {}, { params: data })

const getCode = (data: TGetCodeReq): TAxiosResponse<unknown> =>
  api.post('/code', {}, { params: data })

export const apiOtp = {
  sendCode,
  getCode,
}
