import { api } from '@/api-rest/instance'
import { TAxiosResponse } from '@/types/axios'
import { TUserData } from '@/containers/user'
import { TSignUpReq } from './types'

export type TPhoneCodeReq = {
  phoneConfirmationCode: string
}

export type TSignUpRes = TUserData

// sign-up
const signUp = (data: TSignUpReq): TAxiosResponse<TUserData> =>
  api.post('auth/register', { ...data, passwordConfirmation: data.password })

export const apiSignUp = {
  signUp,
}
