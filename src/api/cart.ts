import { apiClient } from '@/libs/axios'
import { API_BASE_URL, USE_MOCK_API } from '@/config/api'
import {
  mockReserveStock,
  mockReleaseStock,
  mockUpdateCartItem,
} from './mock-cart-service'

export interface ReserveStockRequest {
  ticketId: string
  quantity: number
}

export interface ReserveStockResponse {
  success: boolean
  reservedQuantity: number
  remainingStock: number
}

export interface ReleaseStockRequest {
  ticketId: string
  quantity: number
}

export interface ReleaseStockResponse {
  success: boolean
  releasedQuantity: number
  remainingStock: number
}

export interface UpdateCartRequest {
  cartId: string
  quantity: number
}

export interface UpdateCartResponse {
  success: boolean
  updatedQuantity: number
  remainingStock: number
}

/**
 * ตัดสต๊อกเมื่อหยิบใส่ตะกร้า
 */
export const reserveStock = async (
  request: ReserveStockRequest,
): Promise<ReserveStockResponse> => {
  if (USE_MOCK_API) {
    return mockReserveStock(request)
  }

  const { data } = await apiClient.post<ReserveStockResponse>(
    `${API_BASE_URL}/cart/reserve`,
    request,
  )
  return data
}

/**
 * คืนสต๊อกเมื่อลบออกจากตะกร้าหรือหมดเวลาจอง
 */
export const releaseStock = async (
  request: ReleaseStockRequest,
): Promise<ReleaseStockResponse> => {
  if (USE_MOCK_API) {
    return mockReleaseStock(request)
  }

  const { data } = await apiClient.post<ReleaseStockResponse>(
    `${API_BASE_URL}/cart/release`,
    request,
  )
  return data
}

/**
 * อัพเดทจำนวนในตะกร้า
 */
export const updateCartItem = async (
  request: UpdateCartRequest,
): Promise<UpdateCartResponse> => {
  if (USE_MOCK_API) {
    return mockUpdateCartItem(request)
  }

  const { data } = await apiClient.put<UpdateCartResponse>(
    `${API_BASE_URL}/cart/update`,
    request,
  )
  return data
}

