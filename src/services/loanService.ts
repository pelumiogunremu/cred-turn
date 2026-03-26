export interface LendingPartner {
  id: string;
  name: string;
  interestRate: number;
  duration: number; // in months
  monthlyEstimate: number;
}

export const loanService = {
  getLendingPartners: (amount: number, isOverdue: boolean): LendingPartner[] => {
    // Base interest rates
    const baseRate = isOverdue ? 12 : 5; // Higher rate for overdue
    
    return [
      {
        id: 'partner-1',
        name: 'FairMoney',
        interestRate: baseRate,
        duration: 3,
        monthlyEstimate: (amount * (1 + baseRate / 100)) / 3
      },
      {
        id: 'partner-2',
        name: 'Carbon',
        interestRate: baseRate + 2,
        duration: 6,
        monthlyEstimate: (amount * (1 + (baseRate + 2) / 100)) / 6
      },
      {
        id: 'partner-3',
        name: 'Kuda Business',
        interestRate: baseRate - 1,
        duration: 1,
        monthlyEstimate: amount * (1 + (baseRate - 1) / 100)
      }
    ];
  },

  applyForLoan: async (partnerId: string, amount: number): Promise<boolean> => {
    console.log(`Applying for loan of ${amount} with partner ${partnerId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    return true; // Assume success for demo
  }
};
