/**
 * bKash payment stub — sandbox mock.
 * No real API calls. Replace with bKash Merchant API in production.
 */

export async function initiatePayment(amount: number, reference: string) {
  // Simulate bKash payment initiation
  return {
    paymentID: `bkash_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    bkashURL: null, // Would be a redirect URL in production
    status: 'pending' as const,
    amount,
    reference,
  };
}

export async function verifyPayment(paymentID: string) {
  // In sandbox, all payments succeed
  return {
    paymentID,
    status: 'completed' as const,
    transactionID: `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
}

export async function refundPayment(transactionID: string) {
  return {
    transactionID,
    status: 'refunded' as const,
    refundID: `REF_${Date.now()}`,
  };
}
