export interface ListResponse<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  data: T[]
}