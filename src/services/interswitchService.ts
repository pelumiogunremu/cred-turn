/// <reference types="vite/client" />
declare global {
  interface Window {
    webpayCheckout: (request: any) => void;
  }
}

export const interswitchService = {
  checkAvailability: () => {
    // Check for standard webpayCheckout or Interswitch global
    return typeof window.webpayCheckout === 'function' || (window as any).Interswitch;
  },

  pay: (amount: number, email: string, name: string, onSuccess: () => void) => {
    if (!interswitchService.checkAvailability()) {
      console.error('Interswitch Inline Checkout script not loaded');
      alert('Payment Error: The payment gateway script is currently unavailable. Please check your internet connection or disable ad-blockers and try again.');
      return;
    }

    const merchantCode = import.meta.env.VITE_INTERSWITCH_MERCHANT_CODE || 'MX26070';
    const payItemID = import.meta.env.VITE_INTERSWITCH_PAY_ITEM_ID || 'Default_Pay_Item_ID';
    const mode = import.meta.env.VITE_INTERSWITCH_MODE || 'TEST';

    const request = {
      merchant_code: merchantCode,
      pay_item_id: payItemID,
      amount: Math.round(amount * 100).toString(), // In kobo (as String)
      customer_email: email,
      customer_name: name,
      cust_id: email, // Added cust_id
      txn_ref: `INV-${Date.now()}`,
      site_redirect_url: window.location.origin + '/payments', // Required by Interswitch SDK
      currency: '566', // NGN
      mode: mode,
      onComplete: (response: any) => {
        console.log('Interswitch Payment Response:', response);
        // Interswitch response codes: '00' is success
        if (response.resp === '00' || response.resp === '0' || response.status === 'success') {
          onSuccess();
        } else {
          alert('Payment Failed: ' + (response.desc || 'Unknown error'));
        }
      }
    };
    
    console.log('Sending Interswitch Request:', request);

    if (typeof window.webpayCheckout === 'function') {
      window.webpayCheckout(request);
    } else if ((window as any).Interswitch) {
      (window as any).Interswitch.webpayCheckout(request);
    }
  }
};
