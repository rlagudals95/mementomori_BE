export enum OrderStatus {
  DRAFT = 'draft',
  PAID = 'paid', // 주문 처리 중
  REJECTED = 'rejected', // 주문 취소 (by admin)
  DELIVERY_IN_PROGRESS = 'delivery_in_progress', // 배송 중
  DELIVERED = 'delivered', // 배송 완료
}
