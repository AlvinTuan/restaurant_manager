import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
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
  },
  getListRequest() {
    return http.get<AccountListResType>('accounts')
  },
  addEmployeeRequest(body: CreateEmployeeAccountBodyType) {
    return http.post<AccountResType>('accounts', body)
  },
  updateEmployeeRequest(id: number, body: UpdateEmployeeAccountBodyType) {
    return http.put<AccountResType>(`accounts/detail/${id}`, body)
  },
  getEmployeeRequest(id: number) {
    return http.get<AccountResType>(`accounts/detail/${id}`)
  },
  deleteEmployeeRequest(id: number) {
    return http.get<AccountResType>(`accounts/detail/${id}`)
  }
}

export default accountApi
