import { AppUrls } from '../enums'

export interface InterfaceAppLink {
    name: string
    path: AppUrls | string
}

export interface StructuredOutput<Data> {
    success: boolean
    data?: Data
    error?: string
}

export interface ApiResponse<T> {
    data?: T
    error?: string
    status: number
}

export interface PaginationParams {
    page?: number
    limit?: number
    orderBy?: string
    order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}
