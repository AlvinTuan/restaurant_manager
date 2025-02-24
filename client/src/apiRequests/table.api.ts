import http from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from '@/schemaValidations/table.schema'

const URL_TABLE = '/tables'

export const tableApiRequest = {
  getList: () => http.get<TableListResType>(`${URL_TABLE}`),
  getTableDetail: (id: number) => http.get<TableResType>(`${URL_TABLE}/${id}`),
  addTable: (body: CreateTableBodyType) => http.post<TableResType>(`${URL_TABLE}`, body),
  updateTable: (id: number, body: UpdateTableBodyType) => http.put<TableResType>(`${URL_TABLE}/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`${URL_TABLE}/${id}`)
}
