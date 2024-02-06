import { api } from '@/api-rest/instance'
import { TAxiosResponse } from '@/api-rest/types'
import { TUserData } from '@/containers/user'
import { TLoginReq } from './types'

const login = (data: TLoginReq): TAxiosResponse<TUserData> =>
  api.post('/auth/login', data)

export const apiSignIn = {
  login,
}
