import type { LotteryTicket } from '@/types'
import type {
  ReserveStockRequest,
  ReserveStockResponse,
  ReleaseStockRequest,
  ReleaseStockResponse,
  UpdateCartRequest,
  UpdateCartResponse,
} from './cart'

// เก็บ stock state ใน memory (จำลอง database)
let stockState: Map<string, number> = new Map()

/**
 * โหลดข้อมูล stock เริ่มต้นจาก lotteries.json
 */
export const initializeStock = async (lotteries: LotteryTicket[]) => {
  lotteries.forEach((lottery) => {
    // ถ้ายังไม่มีใน state หรือ state เป็น 0 ให้ reset เป็นค่าเริ่มต้น
    // แต่ถ้ามีค่าแล้ว (จากการ reserve/release) ให้คงค่าเดิมไว้
    if (!stockState.has(lottery.id)) {
      stockState.set(lottery.id, lottery.remaining)
    }
  })
}

/**
 * รับ stock ปัจจุบันของ ticket
 */
export const getCurrentStock = (ticketId: string): number => {
  return stockState.get(ticketId) ?? 0
}

/**
 * Mock API: ตัดสต๊อก
 */
export const mockReserveStock = async (
  request: ReserveStockRequest,
): Promise<ReserveStockResponse> => {
  // จำลอง network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const currentStock = getCurrentStock(request.ticketId)

  if (currentStock < request.quantity) {
    return {
      success: false,
      reservedQuantity: 0,
      remainingStock: currentStock,
    }
  }

  const newStock = currentStock - request.quantity
  stockState.set(request.ticketId, newStock)

  return {
    success: true,
    reservedQuantity: request.quantity,
    remainingStock: newStock,
  }
}

/**
 * Mock API: คืนสต๊อก
 */
export const mockReleaseStock = async (
  request: ReleaseStockRequest,
): Promise<ReleaseStockResponse> => {
  // จำลอง network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const currentStock = getCurrentStock(request.ticketId)
  const newStock = currentStock + request.quantity
  stockState.set(request.ticketId, newStock)

  return {
    success: true,
    releasedQuantity: request.quantity,
    remainingStock: newStock,
  }
}

/**
 * Mock API: อัพเดทจำนวนในตะกร้า
 */
export const mockUpdateCartItem = async (
  _request: UpdateCartRequest,
): Promise<UpdateCartResponse> => {
  // จำลอง network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // สำหรับ mock นี้เราจะต้องรู้ quantity เดิมและใหม่
  // แต่เนื่องจากเราไม่มี cartId mapping กับ quantity เดิม
  // เราจะใช้วิธีอื่น - ให้ caller ส่ง oldQuantity และ newQuantity แทน
  // แต่เพื่อความง่าย เราจะใช้วิธีอื่น

  // Note: ในกรณีจริง API นี้ควรจะรับ oldQuantity และ newQuantity
  // แต่เพื่อให้ง่าย เราจะให้ caller จัดการเองผ่าน reserve/release

  return {
    success: true,
    updatedQuantity: 0, // จะไม่ใช้ในกรณีนี้
    remainingStock: 0, // จะไม่ใช้ในกรณีนี้
  }
}

/**
 * Reset stock state (สำหรับ testing หรือ reload)
 */
export const resetStockState = (lotteries: LotteryTicket[]) => {
  stockState.clear()
  initializeStock(lotteries)
}

