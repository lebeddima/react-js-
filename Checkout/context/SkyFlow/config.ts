import { apiCheckout } from '../../api/rest'

const getBearerToken = async (): Promise<string> => {
  try {
    const { data } = await apiCheckout.getSkyflowToken()
    return data.accessToken
  } catch (error) {
    return ''
  }
}

const skyFlowconfig = {
  vaultID: process.env.NEXT_PUBLIC_SKYFLOW_VAULT_ID as string,
  vaultURL: process.env.NEXT_PUBLIC_SKYFLOW_VAULT_URL as string,
  getBearerToken,
}

export { skyFlowconfig }
