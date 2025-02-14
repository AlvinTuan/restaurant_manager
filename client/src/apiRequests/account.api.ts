import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import http from '@/utils/http'

const accountApi = {
  meRequest(options?: { signal: AbortSignal }) {
    return http.get<AccountResType>('accounts/me', { signal: options?.signal })
  },
  updateMeRequest(body: UpdateMeBodyType) {
    return http.put<AccountResType>('accounts/me', body)
  },
  changePasswordRequest(body: ChangePasswordBodyType) {
    return http.put<AccountResType>('accounts/change-password', body)
  }
}

export default accountApi
