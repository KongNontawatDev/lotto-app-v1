import { createStore } from 'zustand/vanilla'
import { toast } from 'sonner'

import { releaseStock, reserveStock, updateCartItem } from '@/api/cart'
import type { CartItem, LotteryTicket } from '@/types'

export const RESERVATION_DURATION_MS = 10 * 60 * 1000

type CartState = {
  items: CartItem[]
}

type CartActions = {
  hydrate: (items: CartItem[]) => void
  addItem: (ticket: LotteryTicket) => Promise<void>
  removeItem: (cartId: string) => Promise<void>
  updateItemQuantity: (cartId: string, quantity: number) => Promise<void>
  clearExpired: () => Promise<void>
  clearAll: () => Promise<void>
}

export type CartStore = CartState & CartActions

const createCartItem = (ticket: LotteryTicket): CartItem => ({
  ...ticket,
  cartId:
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${ticket.id}-${Date.now()}`,
  reservedAt: Date.now(),
  quantity: 1,
})

export const cartStore = createStore<CartStore>((set, get) => ({
  items: [],
  hydrate: (items) => set({ items }),
  addItem: async (ticket) => {
    const state = get()
    const existing = state.items.find((item) => item.id === ticket.id)
    const quantityToReserve = existing ? 1 : 1

    try {
      // ตัดสต๊อกผ่าน API
      const response = await reserveStock({
        ticketId: ticket.id,
        quantity: quantityToReserve,
      })

      if (!response.success) {
        toast.error('ไม่สามารถจองสต๊อกได้ กรุณาลองใหม่อีกครั้ง')
        return
      }

      // อัพเดท state
      set((currentState) => {
        if (existing) {
          return {
            items: currentState.items.map((item) =>
              item.id === ticket.id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + 1,
                      response.remainingStock,
                    ),
                    remaining: response.remainingStock,
                    reservedAt: Date.now(),
                  }
                : item,
            ),
          }
        }
        return {
          items: [
            ...currentState.items,
            {
              ...createCartItem(ticket),
              remaining: response.remainingStock,
            },
          ],
        }
      })

      toast.success('เพิ่มลงตะกร้าเรียบร้อย')
    } catch (error) {
      console.error('Error reserving stock:', error)
      toast.error('เกิดข้อผิดพลาดในการจองสต๊อก')
    }
  },
  removeItem: async (cartId) => {
    const state = get()
    const item = state.items.find((item) => item.cartId === cartId)

    if (!item) return

    try {
      // คืนสต๊อกผ่าน API
      const response = await releaseStock({
        ticketId: item.id,
        quantity: item.quantity,
      })

      if (response.success) {
        set((currentState) => ({
          items: currentState.items.filter((item) => item.cartId !== cartId),
        }))
        toast.success('ลบออกจากตะกร้าเรียบร้อย')
      } else {
        toast.error('ไม่สามารถลบรายการได้ กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      console.error('Error releasing stock:', error)
      toast.error('เกิดข้อผิดพลาดในการลบรายการ')
    }
  },
  updateItemQuantity: async (cartId, newQuantity) => {
    const state = get()
    const item = state.items.find((item) => item.cartId === cartId)

    if (!item) return

    const quantityDiff = newQuantity - item.quantity

    try {
      if (quantityDiff > 0) {
        // เพิ่มจำนวน - ตัดสต๊อก
        const response = await reserveStock({
          ticketId: item.id,
          quantity: quantityDiff,
        })

        if (response.success) {
          set((currentState) => ({
            items: currentState.items.map((i) =>
              i.cartId === cartId
                ? {
                    ...i,
                    quantity: newQuantity,
                    remaining: response.remainingStock,
                    reservedAt: Date.now(),
                  }
                : i,
            ),
          }))
        } else {
          toast.error('ไม่สามารถเพิ่มจำนวนได้ สต๊อกไม่พอ')
        }
      } else if (quantityDiff < 0) {
        // ลดจำนวน - คืนสต๊อก
        const response = await releaseStock({
          ticketId: item.id,
          quantity: Math.abs(quantityDiff),
        })

        if (response.success) {
          set((currentState) => ({
            items: currentState.items.map((i) =>
              i.cartId === cartId
                ? {
                    ...i,
                    quantity: newQuantity,
                    remaining: response.remainingStock,
                    reservedAt: Date.now(),
                  }
                : i,
            ),
          }))
        } else {
          toast.error('ไม่สามารถลดจำนวนได้')
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      toast.error('เกิดข้อผิดพลาดในการอัพเดท')
    }
  },
  clearExpired: async () => {
    const now = Date.now()
    const state = get()
    const expiredItems = state.items.filter(
      (item) => now - item.reservedAt >= RESERVATION_DURATION_MS,
    )

    if (expiredItems.length === 0) return

    // คืนสต๊อกทั้งหมดที่หมดเวลา
    const releasePromises = expiredItems.map((item) =>
      releaseStock({
        ticketId: item.id,
        quantity: item.quantity,
      }).catch((error) => {
        console.error(`Error releasing stock for item ${item.cartId}:`, error)
        return { success: false }
      }),
    )

    await Promise.all(releasePromises)

    // ลบรายการที่หมดเวลาออกจาก state
    set((currentState) => ({
      items: currentState.items.filter(
        (item) => now - item.reservedAt < RESERVATION_DURATION_MS,
      ),
    }))

    // แสดง toast แจ้งผู้ใช้
    if (expiredItems.length > 0) {
      toast.warning(
        `รายการ ${expiredItems.length} รายการหมดเวลาจองแล้ว และได้คืนสต๊อกแล้ว`,
      )
    }
  },
  clearAll: async () => {
    const state = get()

    // คืนสต๊อกทั้งหมด
    const releasePromises = state.items.map((item) =>
      releaseStock({
        ticketId: item.id,
        quantity: item.quantity,
      }).catch((error) => {
        console.error(`Error releasing stock for item ${item.cartId}:`, error)
        return { success: false }
      }),
    )

    await Promise.all(releasePromises)
    set({ items: [] })
  },
}))
