export type UserRole = 'guardian' | 'teen';

export type SpendCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Entertainment'
  | 'Shopping'
  | 'Other';

export interface User {
  id: string;
  familyId: string;
  role: UserRole;
  fullName: string;
  email?: string;
  phone: string;
  teenProfileId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDetails {
  maskedAadhaarRef: string; // e.g., "XXXX-XXXX-9142"
  maskedName: string; // e.g., "P*** S***"
  dob: string; // e.g., "1984-05-12"
  gender: 'Female' | 'Male' | 'Other';
  verifiedAt: string;
  consentGiven: boolean;
  algorithm: string; // "Demo-Simulated SHA-256 QR Signature"
}

export interface Family {
  id: string;
  guardianId: string;
  familyName: string;
  familyBalance: number; // mock pool balance
  guardianVerified: boolean;
  verificationDetails?: VerificationDetails;
  createdAt: string;
  updatedAt: string;
}

export interface TeenProfile {
  id: string;
  familyId: string;
  guardianId: string;
  name: string;
  age: number;
  phone: string;
  username: string;
  avatarUrl: string;
  walletId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  teenId: string;
  familyId: string;
  guardianId: string;
  balance: number;
  isPaused: boolean;
  allowanceAmount: number;
  allowanceFrequency: 'weekly' | 'monthly' | 'custom';
  dailySpendingLimit: number;
  spentToday: number;
  categoryLimits: Record<SpendCategory, number>;
  categorySpentMonth: Record<SpendCategory, number>;
  lastAllowanceDate: string;
  updatedAt: string;
}

export type TransactionType = 'spend' | 'allowance_load' | 'request_payout' | 'reversal';
export type TransactionStatus = 'success' | 'failed' | 'reversed';

export interface Transaction {
  id: string;
  familyId: string;
  teenId: string;
  teenName?: string;
  type: TransactionType;
  category: SpendCategory;
  payeeName: string;
  payeeCode?: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  note: string;
  idempotencyKey?: string;
  reversalReason?: string;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface MoneyRequest {
  id: string;
  familyId: string;
  teenId: string;
  teenName: string;
  amount: number;
  category: SpendCategory;
  reason: string;
  status: RequestStatus;
  guardianNote?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface AuditLog {
  id: string;
  familyId: string;
  actorId: string;
  actorRole: UserRole | 'system';
  action: string;
  details: string;
  timestamp: string;
}

export interface DemoMerchant {
  id: string;
  name: string;
  category: SpendCategory;
  upiHandle: string;
  defaultAmount?: number;
  description: string;
  iconName: string;
  qrPayload: string;
}
