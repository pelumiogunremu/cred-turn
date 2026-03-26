import { interswitchService } from './interswitchService';

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  amountPaid: number;
}

export const paymentService = {
  /**
   * Initiates the real Interswitch Inline Checkout
   */
  initiateInterswitchPayment: (
    amount: number,
    userDetails: { name: string; email: string },
    invoiceId: string
  ): Promise<PaymentResult> => {
    return new Promise((resolve) => {
      console.log(`Initiating REAL Interswitch payment for ${amount} on invoice ${invoiceId}`);
      
      interswitchService.pay(
        amount, 
        userDetails.email, 
        userDetails.name, 
        () => {
          // onSuccess callback
          resolve({
            success: true,
            message: 'Payment processed successfully via Interswitch',
            transactionId: `ISW-${Date.now()}`,
            amountPaid: amount
          });
        }
      );

      // Note: Interswitch Inline Checkout handles its own UI over the page.
      // If the user closes the modal, we might need an onCancel or 
      // just let them retry. The current interswitchService doesn't 
      // have an onCancel yet, but for now we resolve on success.
    });
  }
};
