import { AccountResType } from '@/schemaValidations/account.schema'
import http from '@/utils/http'

const accountApi = {
  me(options?: { signal: AbortSignal }) {
    return http.get<AccountResType>('accounts/me', { signal: options?.signal })
  }
}

export default accountApi
