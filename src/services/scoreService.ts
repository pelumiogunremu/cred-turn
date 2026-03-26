export const scoreService = {
  calculateScoreChange: (action: 'full_payment' | 'partial_payment' | 'loan_payment' | 'overdue_payment'): number => {
    switch (action) {
      case 'full_payment': return 5;
      case 'partial_payment': return 2;
      case 'loan_payment': return 1;
      case 'overdue_payment': return 1;
      default: return 0;
    }
  }
};
