# CredTurn — Reimagining Credit Transactions

## Project Overview

CredTurn is a credit transaction-focused platform that ensures informal credit transactions are completed — not just recorded.

In many real-world scenarios, sellers provide goods or services on credit without guarantees of repayment. CredTurn introduces structure, real-time tracking, and flexible repayment mechanisms to ensure that every credit transaction reaches completion.

The platform combines:
- Structured credit agreements between buyers and sellers  
- Integrated payment flows powered by Interswitch API  
- Payment fallback mechanisms that activate when repayment is due  

Buyers are rewarded through the CredTurn Score, which unlocks access to high-value goods, distant sellers, and credit card eligibility, provided they maintain consistent on-time repayment behavior. This directly contributes to financial inclusion.

---

## Problem

Credit transactions are frequent and essential for daily commerce in informal economies, particularly among small and medium enterprises, but they are fundamentally broken:

- Sellers have no guarantee of payment  
- Buyers default due to temporary liquidity constraints  
- There is no structured agreement or flexible repayment system  
- There is no fallback mechanism when payments fail  

These challenges result in:
- Incomplete transactions  
- Cash flow disruption for businesses  
- Erosion of trust between parties  
- Escalation into disputes and conflict  

---

## Solution

CredTurn transforms informal credit into a structured, trackable, and complete system by:

- Converting credit into digital invoices  
- Tracking obligations in real time  
- Enabling multiple repayment options  
- Activating fallback mechanisms at the point of default  

### Core Hypothesis

If informal credit transactions are structured with clear agreements, flexible repayment options, and contextual payment fallback mechanisms, then:

- Payment completion rates will increase  
- Transaction friction and disputes will decrease  
- Sellers will recover revenue more reliably  
- Buyers will maintain credibility without immediate liquidity pressure  

CredTurn ensures that payments are completed even when buyers are temporarily unable to meet their obligations.

---

## MVP Core Features

- Invoice Management System  
- Real-time Credit Transaction Tracking  
- Payment via Debit with Interswitch Integration  
- Payment via Loan (lending partners), Goods, or Services fallback  
- CredTurn Score (behavior-based trust system)  
- Notification System  

---

## System Architecture

CredTurn is built as an interconnected system consisting of:

- Invoice Management System — handles invoice creation, acceptance, and status updates  
- Credit Transaction System — tracks all credit activities and states  
- Payment System — executes payments with Interswitch integration  
- CredTurn Score System — dynamically updates user trust based on behavior  
- Notification System — synchronizes real-time updates across users  

All systems are tightly synchronized to ensure a seamless end-to-end transaction flow.

---

## Demo Flow

- Seller creates an invoice  
- Buyer receives and accepts the invoice  
- Transaction is recorded in real time  
- Buyer initiates payment  
- If unable to pay, fallback options are presented  
- Payment is completed and system updates instantly  

---

## Tech Stack

- Frontend: TypeScript, React  
- Backend: Structured state and API-driven logic  
- Payment Integration: Interswitch API  
- Design: Google AI Studio, Stitch  

---

## Contributions

### Oluwapelumi Ogunremu — Product, Design and Strategy

- Product vision and system architecture design  
- End-to-end user experience design  
- UI/UX flows across Dashboard, Transactions, Payments, and Profile  
- Prompt engineering for rapid development using Stitch and Google AI Studio  
- Feature design including CredTurn Score system, credit fallback logic, and multi-payment modes  
- Demo strategy and pitch development  
- Documentation and product positioning  

### Emmanuel Eseyin — Full-stack Development

- Frontend implementation  
- Backend logic and system integration  
- Invoice management system development  
- Transaction system synchronization  
- Payment system integration with Interswitch API  
- State management and real-time updates  
- Bug fixes, optimization, and performance improvements  
- Ensuring system stability across flows  

---

## Innovation

CredTurn is not a payment or lending platform. It is a credit transaction infrastructure that:

- Adapts repayment based on user context  
- Introduces fallback mechanisms at the point of default  
- Enables multi-modal repayment including debit, loan, goods, and services  
- Builds trust through behavioral scoring  

This fundamentally changes how informal credit systems operate.

---

## Completeness

- Fully functional end-to-end system  
- Real-time synchronization across all modules  
- Interactive user interface with no dead flows  
- Integrated payment infrastructure  
- Demo-ready with working user flows  

---

## Future Roadmap

- Expansion of lending partner integrations  
- Enablement of goods and services repayment  
- Enhanced intelligence for CredTurn Score  
- Introduction of CredTurn credit cards  
- Scaling across SMEs and informal markets  

---

CredTurn ensures that credit transactions do not just begin — they are completed. It is infrastructure for trust in informal economies.
