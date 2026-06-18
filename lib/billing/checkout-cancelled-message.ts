const REASON_MESSAGES: Record<string, string> = {
  cancelled: 'You left checkout before completing payment. No charge was made.',
  canceled: 'You left checkout before completing payment. No charge was made.',
  user_cancelled: 'You cancelled the payment. No charge was made.',
  payment_failed: 'Your payment could not be processed. Try another card or payment method.',
  declined: 'Your card was declined. Check your details or try a different payment method.',
  expired: 'The checkout session expired. Please start again from the plans page.',
}

export function resolveCheckoutCancelledMessage(reasonParam: string | null): {
  title: string
  description: string
} {
  const key = String(reasonParam || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')

  if (key && REASON_MESSAGES[key]) {
    const isDecline = key === 'payment_failed' || key === 'declined'
    return {
      title: isDecline ? 'Payment failed' : 'Checkout cancelled',
      description: REASON_MESSAGES[key],
    }
  }

  if (key) {
    return {
      title: 'Payment not completed',
      description: reasonParam!.trim(),
    }
  }

  return {
    title: 'Payment not completed',
    description:
      'Checkout was cancelled or the payment did not go through. You can try again or continue on the free plan.',
  }
}
