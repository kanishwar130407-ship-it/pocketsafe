import {
  Family,
  TeenProfile,
  Wallet,
  Transaction,
  MoneyRequest,
  AuditLog,
  User,
  SpendCategory,
  DemoMerchant,
  VerificationDetails,
} from '../types';

export const DEMO_MERCHANTS: DemoMerchant[] = [
  {
    id: 'm1',
    name: 'Metro City SmartCard',
    category: 'Travel',
    upiHandle: 'citymetro@demoupi',
    defaultAmount: 40,
    description: 'City metro rail transit top-up and turnstile tap',
    iconName: 'Train',
    qrPayload: 'upi://pay?pa=citymetro@demoupi&pn=Metro%20City%20SmartCard&mc=4111&mode=02&purpose=00',
  },
  {
    id: 'm2',
    name: 'Campus Canteen & Cafe',
    category: 'Food',
    upiHandle: 'canteen.express@demoupi',
    defaultAmount: 75,
    description: 'School canteen samosas, sandwiches, and fresh juices',
    iconName: 'Coffee',
    qrPayload: 'upi://pay?pa=canteen.express@demoupi&pn=Campus%20Canteen&mc=5814&mode=02&purpose=00',
  },
  {
    id: 'm3',
    name: 'Crossword Stationery & Books',
    category: 'Education',
    upiHandle: 'crossword.edu@demoupi',
    defaultAmount: 220,
    description: 'Class notebooks, geometry sets, and reference books',
    iconName: 'BookOpen',
    qrPayload: 'upi://pay?pa=crossword.edu@demoupi&pn=Crossword%20Stationery&mc=5942&mode=02&purpose=00',
  },
  {
    id: 'm4',
    name: 'GameZone & VR Arcade',
    category: 'Entertainment',
    upiHandle: 'gamezone.fun@demoupi',
    defaultAmount: 300,
    description: 'Weekend laser tag, bowling, and simulator tokens',
    iconName: 'Gamepad2',
    qrPayload: 'upi://pay?pa=gamezone.fun@demoupi&pn=GameZone%20Arcade&mc=7994&mode=02&purpose=00',
  },
  {
    id: 'm5',
    name: 'Corner Treat Bakery',
    category: 'Food',
    upiHandle: 'treatsbakery@demoupi',
    defaultAmount: 95,
    description: 'Warm patties, rolls, and afternoon pastries',
    iconName: 'Cake',
    qrPayload: 'upi://pay?pa=treatsbakery@demoupi&pn=Corner%20Treat%20Bakery&mc=5462&mode=02&purpose=00',
  },
  {
    id: 'm6',
    name: 'Campus Print & Stationary',
    category: 'Education',
    upiHandle: 'campusprint@demoupi',
    defaultAmount: 35,
    description: 'Project printing, spiral binding, and chart sheets',
    iconName: 'Printer',
    qrPayload: 'upi://pay?pa=campusprint@demoupi&pn=Campus%20Print%20Hub&mc=7338&mode=02&purpose=00',
  },
  {
    id: 'm7',
    name: 'Decathlon Sports Gear',
    category: 'Shopping',
    upiHandle: 'decathlon.mall@demoupi',
    defaultAmount: 499,
    description: 'Badminton shuttlecocks, grip tape, and water bottles',
    iconName: 'ShoppingBag',
    qrPayload: 'upi://pay?pa=decathlon.mall@demoupi&pn=Decathlon%20Express&mc=5941&mode=02&purpose=00',
  },
];

const STORAGE_KEY = 'pocketsafe_app_state_v1';

export interface AppState {
  currentUserId: string;
  family: Family;
  users: User[];
  teens: TeenProfile[];
  wallets: Record<string, Wallet>; // keyed by walletId
  transactions: Transaction[];
  moneyRequests: MoneyRequest[];
  auditLogs: AuditLog[];
}

function getInitialState(): AppState {
  const familyId = 'family_sharma_01';
  const guardianId = 'guardian_priya';
  const aaravTeenId = 'teen_aarav';
  const ananyaTeenId = 'teen_ananya';
  const aaravWalletId = 'wallet_aarav';
  const ananyaWalletId = 'wallet_ananya';

  const initialVerification: VerificationDetails = {
    maskedAadhaarRef: 'XXXX-XXXX-8921',
    maskedName: 'P*** S***',
    dob: '1984-06-14',
    gender: 'Female',
    verifiedAt: '2026-10-15T10:30:00Z',
    consentGiven: true,
    algorithm: 'Demo-Simulated SHA-256 QR Signature',
  };

  const family: Family = {
    id: familyId,
    guardianId,
    familyName: 'Sharma Family',
    familyBalance: 7500,
    guardianVerified: true,
    verificationDetails: initialVerification,
    createdAt: '2026-10-15T10:30:00Z',
    updatedAt: '2026-10-28T18:00:00Z',
  };

  const users: User[] = [
    {
      id: guardianId,
      familyId,
      role: 'guardian',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-10-15T10:30:00Z',
      updatedAt: '2026-10-28T18:00:00Z',
    },
    {
      id: aaravTeenId,
      familyId,
      role: 'teen',
      fullName: 'Aarav Sharma',
      phone: '+91 98765 11001',
      teenProfileId: aaravTeenId,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-10-16T11:00:00Z',
      updatedAt: '2026-10-28T18:00:00Z',
    },
    {
      id: ananyaTeenId,
      familyId,
      role: 'teen',
      fullName: 'Ananya Sharma',
      phone: '+91 98765 22002',
      teenProfileId: ananyaTeenId,
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-10-16T11:20:00Z',
      updatedAt: '2026-10-28T18:00:00Z',
    },
  ];

  const teens: TeenProfile[] = [
    {
      id: aaravTeenId,
      familyId,
      guardianId,
      name: 'Aarav Sharma',
      age: 15,
      phone: '+91 98765 11001',
      username: 'aarav15',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      walletId: aaravWalletId,
      createdAt: '2026-10-16T11:00:00Z',
      updatedAt: '2026-10-28T18:00:00Z',
    },
    {
      id: ananyaTeenId,
      familyId,
      guardianId,
      name: 'Ananya Sharma',
      age: 13,
      phone: '+91 98765 22002',
      username: 'ananya13',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      walletId: ananyaWalletId,
      createdAt: '2026-10-16T11:20:00Z',
      updatedAt: '2026-10-28T18:00:00Z',
    },
  ];

  const wallets: Record<string, Wallet> = {
    [aaravWalletId]: {
      id: aaravWalletId,
      teenId: aaravTeenId,
      familyId,
      guardianId,
      balance: 540,
      isPaused: false,
      allowanceAmount: 1000,
      allowanceFrequency: 'weekly',
      dailySpendingLimit: 400,
      spentToday: 110,
      categoryLimits: {
        Food: 2000,
        Travel: 1500,
        Education: 1200,
        Entertainment: 800,
        Shopping: 1000,
        Other: 500,
      },
      categorySpentMonth: {
        Food: 720,
        Travel: 360,
        Education: 340,
        Entertainment: 300,
        Shopping: 0,
        Other: 40,
      },
      lastAllowanceDate: '2026-10-26T09:00:00Z',
      updatedAt: '2026-10-29T08:00:00Z',
    },
    [ananyaWalletId]: {
      id: ananyaWalletId,
      teenId: ananyaTeenId,
      familyId,
      guardianId,
      balance: 380,
      isPaused: false,
      allowanceAmount: 600,
      allowanceFrequency: 'weekly',
      dailySpendingLimit: 250,
      spentToday: 40,
      categoryLimits: {
        Food: 1200,
        Travel: 800,
        Education: 1500,
        Entertainment: 500,
        Shopping: 500,
        Other: 300,
      },
      categorySpentMonth: {
        Food: 320,
        Travel: 120,
        Education: 410,
        Entertainment: 0,
        Shopping: 140,
        Other: 0,
      },
      lastAllowanceDate: '2026-10-26T09:00:00Z',
      updatedAt: '2026-10-29T08:00:00Z',
    },
  };

  const transactions: Transaction[] = [
    {
      id: 'tx_demo_01',
      familyId,
      teenId: aaravTeenId,
      teenName: 'Aarav Sharma',
      type: 'spend',
      category: 'Food',
      payeeName: 'Campus Canteen & Cafe',
      payeeCode: 'canteen.express@demoupi',
      amount: 70,
      balanceBefore: 650,
      balanceAfter: 580,
      status: 'success',
      note: 'Lunch snack & cold mango juice',
      createdAt: '2026-10-29T08:15:00Z',
    },
    {
      id: 'tx_demo_02',
      familyId,
      teenId: aaravTeenId,
      teenName: 'Aarav Sharma',
      type: 'spend',
      category: 'Travel',
      payeeName: 'Metro City SmartCard',
      payeeCode: 'citymetro@demoupi',
      amount: 40,
      balanceBefore: 580,
      balanceAfter: 540,
      status: 'success',
      note: 'Metro card return fare',
      createdAt: '2026-10-29T07:45:00Z',
    },
    {
      id: 'tx_demo_03',
      familyId,
      teenId: ananyaTeenId,
      teenName: 'Ananya Sharma',
      type: 'spend',
      category: 'Travel',
      payeeName: 'Metro City SmartCard',
      payeeCode: 'citymetro@demoupi',
      amount: 40,
      balanceBefore: 420,
      balanceAfter: 380,
      status: 'success',
      note: 'School commute ticket',
      createdAt: '2026-10-29T07:30:00Z',
    },
    {
      id: 'tx_demo_04',
      familyId,
      teenId: aaravTeenId,
      teenName: 'Aarav Sharma',
      type: 'spend',
      category: 'Education',
      payeeName: 'Crossword Stationery & Books',
      payeeCode: 'crossword.edu@demoupi',
      amount: 190,
      balanceBefore: 840,
      balanceAfter: 650,
      status: 'success',
      note: 'Physics class record notebooks',
      createdAt: '2026-10-28T16:20:00Z',
    },
    {
      id: 'tx_demo_05',
      familyId,
      teenId: aaravTeenId,
      teenName: 'Aarav Sharma',
      type: 'allowance_load',
      category: 'Other',
      payeeName: 'PocketSafe Family Allowance',
      amount: 1000,
      balanceBefore: 0,
      balanceAfter: 1000,
      status: 'success',
      note: 'Weekly allowance auto-transferred by Priya',
      createdAt: '2026-10-26T09:00:00Z',
    },
    {
      id: 'tx_demo_06',
      familyId,
      teenId: ananyaTeenId,
      teenName: 'Ananya Sharma',
      type: 'allowance_load',
      category: 'Other',
      payeeName: 'PocketSafe Family Allowance',
      amount: 600,
      balanceBefore: 20,
      balanceAfter: 620,
      status: 'success',
      note: 'Weekly allowance transferred by Priya',
      createdAt: '2026-10-26T09:00:00Z',
    },
  ];

  const moneyRequests: MoneyRequest[] = [
    {
      id: 'req_01',
      familyId,
      teenId: aaravTeenId,
      teenName: 'Aarav Sharma',
      amount: 350,
      category: 'Education',
      reason: 'National Science Olympiad practice sample papers bundle',
      status: 'pending',
      createdAt: '2026-10-29T06:00:00Z',
    },
    {
      id: 'req_02',
      familyId,
      teenId: ananyaTeenId,
      teenName: 'Ananya Sharma',
      amount: 200,
      category: 'Education',
      reason: 'Drawing watercolor kit for school art competition',
      status: 'approved',
      guardianNote: 'Approved! Best of luck for the art competition beta.',
      createdAt: '2026-10-27T14:10:00Z',
      respondedAt: '2026-10-27T15:00:00Z',
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'log_01',
      familyId,
      actorId: guardianId,
      actorRole: 'guardian',
      action: 'FAMILY_INITIALIZED',
      details: 'Family account created with mock Aadhaar verification completed',
      timestamp: '2026-10-15T10:30:00Z',
    },
    {
      id: 'log_02',
      familyId,
      actorId: guardianId,
      actorRole: 'guardian',
      action: 'ALLOWANCE_SCHEDULED',
      details: 'Weekly allowance configured for Aarav (₹1,000) and Ananya (₹600)',
      timestamp: '2026-10-16T11:30:00Z',
    },
    {
      id: 'log_03',
      familyId,
      actorId: guardianId,
      actorRole: 'guardian',
      action: 'LIMIT_UPDATED',
      details: 'Aarav daily spending limit set to ₹400',
      timestamp: '2026-10-20T12:00:00Z',
    },
  ];

  return {
    currentUserId: guardianId,
    family,
    users,
    teens,
    wallets,
    transactions,
    moneyRequests,
    auditLogs,
  };
}

class Store {
  private state: AppState;
  private listeners: Array<() => void> = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load PocketSafe local storage:', e);
    }
    const initial = getInitialState();
    this.persist(initial);
    return initial;
  }

  private persist(state: AppState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.persist(this.state);
    this.listeners.forEach((l) => l());
  }

  public resetToDefault() {
    this.state = getInitialState();
    this.notify();
  }

  public setCurrentUser(userId: string) {
    this.state.currentUserId = userId;
    this.notify();
  }

  public getCurrentUser(): User | undefined {
    return this.state.users.find((u) => u.id === this.state.currentUserId);
  }

  public getGuardian(): User | undefined {
    return this.state.users.find((u) => u.role === 'guardian');
  }

  public getTeenProfile(teenId: string): TeenProfile | undefined {
    return this.state.teens.find((t) => t.id === teenId);
  }

  public getWallet(walletId: string): Wallet | undefined {
    return this.state.wallets[walletId];
  }

  public getTeenWallet(teenId: string): Wallet | undefined {
    return Object.values(this.state.wallets).find((w) => w.teenId === teenId);
  }

  // GUARDIAN ACTION: Load mock money into family pool
  public addFamilyMoney(amount: number, method: string = 'Demo UPI / NetBanking'): boolean {
    if (amount <= 0) return false;
    this.state.family.familyBalance += amount;
    this.state.family.updatedAt = new Date().toISOString();

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'FAMILY_FUNDS_LOADED',
      details: `Added ₹${amount.toLocaleString('en-IN')} to family balance via ${method}`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return true;
  }

  // GUARDIAN ACTION: Allocate mock money from family pool to a teen wallet
  public allocateAllowance(
    teenId: string,
    amount: number,
    note: string = 'Allowance Allocation'
  ): { success: boolean; error?: string } {
    if (amount <= 0) {
      return { success: false, error: 'Allocation amount must be greater than zero.' };
    }
    if (this.state.family.familyBalance < amount) {
      return {
        success: false,
        error: `Insufficient family balance (₹${this.state.family.familyBalance.toLocaleString('en-IN')} available). Please load family funds first.`,
      };
    }

    const teen = this.getTeenProfile(teenId);
    const wallet = this.getTeenWallet(teenId);
    if (!teen || !wallet) {
      return { success: false, error: 'Teen wallet not found.' };
    }

    // Deduct from family pool
    this.state.family.familyBalance -= amount;

    // Credit teen wallet
    const balanceBefore = wallet.balance;
    wallet.balance += amount;
    wallet.lastAllowanceDate = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();

    // Create immutable ledger entry
    const newTx: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      familyId: this.state.family.id,
      teenId: teen.id,
      teenName: teen.name,
      type: 'allowance_load',
      category: 'Other',
      payeeName: 'PocketSafe Allowance Credit',
      amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      status: 'success',
      note,
      createdAt: new Date().toISOString(),
    };
    this.state.transactions.unshift(newTx);

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'ALLOWANCE_ALLOCATED',
      details: `Transferred ₹${amount} to ${teen.name}'s wallet`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true };
  }

  // GUARDIAN ACTION: Update teen limits and pause status
  public updateWalletControls(
    walletId: string,
    updates: {
      isPaused?: boolean;
      dailySpendingLimit?: number;
      allowanceAmount?: number;
      allowanceFrequency?: 'weekly' | 'monthly' | 'custom';
      categoryLimits?: Partial<Record<SpendCategory, number>>;
    }
  ): boolean {
    const wallet = this.state.wallets[walletId];
    if (!wallet) return false;

    if (updates.isPaused !== undefined) {
      wallet.isPaused = updates.isPaused;
    }
    if (updates.dailySpendingLimit !== undefined && updates.dailySpendingLimit >= 0) {
      wallet.dailySpendingLimit = updates.dailySpendingLimit;
    }
    if (updates.allowanceAmount !== undefined && updates.allowanceAmount >= 0) {
      wallet.allowanceAmount = updates.allowanceAmount;
    }
    if (updates.allowanceFrequency !== undefined) {
      wallet.allowanceFrequency = updates.allowanceFrequency;
    }
    if (updates.categoryLimits) {
      wallet.categoryLimits = {
        ...wallet.categoryLimits,
        ...updates.categoryLimits,
      };
    }
    wallet.updatedAt = new Date().toISOString();

    const teen = this.getTeenProfile(wallet.teenId);
    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'WALLET_CONTROLS_UPDATED',
      details: `Updated settings/limits for ${teen?.name || wallet.teenId}`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return true;
  }

  // GUARDIAN ACTION: Register a new teen profile
  public addTeenProfile(data: {
    name: string;
    age: number;
    phone: string;
    username: string;
    initialAllowance: number;
    dailyLimit: number;
    categoryLimits: Record<SpendCategory, number>;
  }): { success: boolean; error?: string; teenId?: string } {
    if (data.age >= 18 || data.age < 7) {
      return { success: false, error: 'PocketSafe is for teens and minors aged 7 to 17.' };
    }
    if (!data.name.trim() || !data.username.trim()) {
      return { success: false, error: 'Teen name and username are required.' };
    }

    const teenId = 'teen_' + Date.now();
    const walletId = 'wallet_' + Date.now();

    const newTeen: TeenProfile = {
      id: teenId,
      familyId: this.state.family.id,
      guardianId: this.state.family.guardianId,
      name: data.name.trim(),
      age: data.age,
      phone: data.phone.trim() || '+91 98000 00000',
      username: data.username.toLowerCase().trim(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      walletId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newWallet: Wallet = {
      id: walletId,
      teenId,
      familyId: this.state.family.id,
      guardianId: this.state.family.guardianId,
      balance: 0,
      isPaused: false,
      allowanceAmount: data.initialAllowance,
      allowanceFrequency: 'weekly',
      dailySpendingLimit: data.dailyLimit,
      spentToday: 0,
      categoryLimits: data.categoryLimits,
      categorySpentMonth: {
        Food: 0,
        Travel: 0,
        Education: 0,
        Entertainment: 0,
        Shopping: 0,
        Other: 0,
      },
      lastAllowanceDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newUser: User = {
      id: teenId,
      familyId: this.state.family.id,
      role: 'teen',
      fullName: data.name.trim(),
      phone: data.phone.trim() || '+91 98000 00000',
      teenProfileId: teenId,
      avatarUrl: newTeen.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.teens.push(newTeen);
    this.state.wallets[walletId] = newWallet;
    this.state.users.push(newUser);

    // Initial allowance allocation if requested and balance is available
    if (data.initialAllowance > 0 && this.state.family.familyBalance >= data.initialAllowance) {
      this.state.family.familyBalance -= data.initialAllowance;
      newWallet.balance = data.initialAllowance;

      this.state.transactions.unshift({
        id: 'tx_' + Date.now(),
        familyId: this.state.family.id,
        teenId,
        teenName: newTeen.name,
        type: 'allowance_load',
        category: 'Other',
        payeeName: 'Welcome Allowance Credit',
        amount: data.initialAllowance,
        balanceBefore: 0,
        balanceAfter: data.initialAllowance,
        status: 'success',
        note: 'Initial welcome allowance loaded by guardian',
        createdAt: new Date().toISOString(),
      });
    }

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'TEEN_REGISTERED',
      details: `Created teen profile for ${data.name} (age ${data.age})`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true, teenId };
  }

  // TEEN ACTION: Spend at demo merchant
  public spendMoney(params: {
    teenId: string;
    amount: number;
    category: SpendCategory;
    payeeName: string;
    payeeCode?: string;
    note?: string;
    idempotencyKey?: string;
  }): { success: boolean; error?: string; transaction?: Transaction } {
    const { teenId, amount, category, payeeName, payeeCode, note = '', idempotencyKey } = params;

    // Check duplicate submission
    if (idempotencyKey) {
      const existingTx = this.state.transactions.find((t) => t.idempotencyKey === idempotencyKey);
      if (existingTx) {
        return { success: true, transaction: existingTx };
      }
    }

    if (amount <= 0) {
      return { success: false, error: 'Transaction amount must be greater than zero.' };
    }

    const teen = this.getTeenProfile(teenId);
    const wallet = this.getTeenWallet(teenId);
    if (!teen || !wallet) {
      return { success: false, error: 'Wallet not found.' };
    }

    // 1. Check wallet pause status
    if (wallet.isPaused) {
      return {
        success: false,
        error: 'Wallet is currently paused by your guardian. Spends are temporarily locked for safety.',
      };
    }

    // 2. Check balance (Teen must never go negative or borrow)
    if (wallet.balance < amount) {
      return {
        success: false,
        error: `Insufficient balance. Available: ₹${wallet.balance.toLocaleString('en-IN')}, Required: ₹${amount.toLocaleString('en-IN')}.`,
      };
    }

    // 3. Check daily spending limit
    const dailyRemaining = Math.max(0, wallet.dailySpendingLimit - wallet.spentToday);
    if (amount > dailyRemaining) {
      return {
        success: false,
        error: `Daily spending limit reached! You can only spend up to ₹${dailyRemaining.toLocaleString('en-IN')} more today (Daily limit: ₹${wallet.dailySpendingLimit.toLocaleString('en-IN')}).`,
      };
    }

    // 4. Check category limit
    const catLimit = wallet.categoryLimits[category] ?? 1000;
    const catSpent = wallet.categorySpentMonth[category] ?? 0;
    const catRemaining = Math.max(0, catLimit - catSpent);
    if (amount > catRemaining) {
      return {
        success: false,
        error: `Category limit for ${category} exceeded! Remaining this month: ₹${catRemaining.toLocaleString('en-IN')} (Limit: ₹${catLimit.toLocaleString('en-IN')}).`,
      };
    }

    // Valid spend: Deduct atomically
    const balanceBefore = wallet.balance;
    wallet.balance -= amount;
    wallet.spentToday += amount;
    wallet.categorySpentMonth[category] = (wallet.categorySpentMonth[category] || 0) + amount;
    wallet.updatedAt = new Date().toISOString();

    const transaction: Transaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      familyId: this.state.family.id,
      teenId: teen.id,
      teenName: teen.name,
      type: 'spend',
      category,
      payeeName,
      payeeCode: payeeCode || 'merchant@demoupi',
      amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      status: 'success',
      note: note || `Payment to ${payeeName}`,
      idempotencyKey,
      createdAt: new Date().toISOString(),
    };

    this.state.transactions.unshift(transaction);

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: teen.id,
      actorRole: 'teen',
      action: 'MERCHANT_SPEND',
      details: `${teen.name} spent ₹${amount} at ${payeeName} (${category})`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true, transaction };
  }

  // TEEN ACTION: Request money / allowance top-up
  public requestMoney(params: {
    teenId: string;
    amount: number;
    category: SpendCategory;
    reason: string;
  }): { success: boolean; error?: string; request?: MoneyRequest } {
    const { teenId, amount, category, reason } = params;

    if (amount <= 0) {
      return { success: false, error: 'Request amount must be greater than zero.' };
    }
    if (!reason.trim()) {
      return { success: false, error: 'Please provide a reason for the request.' };
    }

    const teen = this.getTeenProfile(teenId);
    if (!teen) {
      return { success: false, error: 'Teen profile not found.' };
    }

    const newRequest: MoneyRequest = {
      id: 'req_' + Date.now(),
      familyId: this.state.family.id,
      teenId: teen.id,
      teenName: teen.name,
      amount,
      category,
      reason: reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.state.moneyRequests.unshift(newRequest);

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: teen.id,
      actorRole: 'teen',
      action: 'MONEY_REQUESTED',
      details: `${teen.name} requested ₹${amount} for "${reason}" (${category})`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true, request: newRequest };
  }

  // GUARDIAN ACTION: Approve money request
  public approveMoneyRequest(
    requestId: string,
    guardianNote: string = 'Approved by guardian'
  ): { success: boolean; error?: string } {
    const request = this.state.moneyRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return { success: false, error: 'Request not found or already processed.' };
    }

    if (this.state.family.familyBalance < request.amount) {
      return {
        success: false,
        error: `Insufficient family balance (₹${this.state.family.familyBalance.toLocaleString('en-IN')} available). Please add family funds to approve ₹${request.amount}.`,
      };
    }

    const teen = this.getTeenProfile(request.teenId);
    const wallet = this.getTeenWallet(request.teenId);
    if (!teen || !wallet) {
      return { success: false, error: 'Teen wallet not found.' };
    }

    // Deduct from family balance
    this.state.family.familyBalance -= request.amount;

    // Credit teen wallet
    const balanceBefore = wallet.balance;
    wallet.balance += request.amount;
    wallet.updatedAt = new Date().toISOString();

    // Update request state
    request.status = 'approved';
    request.guardianNote = guardianNote;
    request.respondedAt = new Date().toISOString();

    // Create payout transaction record
    this.state.transactions.unshift({
      id: 'tx_' + Date.now(),
      familyId: this.state.family.id,
      teenId: teen.id,
      teenName: teen.name,
      type: 'request_payout',
      category: request.category,
      payeeName: `Approved Request: ${request.reason}`,
      amount: request.amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      status: 'success',
      note: guardianNote,
      createdAt: new Date().toISOString(),
    });

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'REQUEST_APPROVED',
      details: `Approved ₹${request.amount} for ${teen.name}`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true };
  }

  // GUARDIAN ACTION: Reject money request
  public rejectMoneyRequest(
    requestId: string,
    guardianNote: string
  ): { success: boolean; error?: string } {
    const request = this.state.moneyRequests.find((r) => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return { success: false, error: 'Request not found or already processed.' };
    }

    request.status = 'rejected';
    request.guardianNote = guardianNote || 'Declined by guardian for now.';
    request.respondedAt = new Date().toISOString();

    const teen = this.getTeenProfile(request.teenId);
    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'REQUEST_REJECTED',
      details: `Declined ₹${request.amount} request for ${teen?.name || request.teenName}`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true };
  }

  // GUARDIAN ACTION: Reverse / Refund transaction
  public reverseTransaction(
    transactionId: string,
    reason: string = 'Reversed by guardian'
  ): { success: boolean; error?: string } {
    const tx = this.state.transactions.find((t) => t.id === transactionId);
    if (!tx) {
      return { success: false, error: 'Transaction not found.' };
    }
    if (tx.status === 'reversed') {
      return { success: false, error: 'Transaction has already been reversed.' };
    }
    if (tx.type !== 'spend') {
      return { success: false, error: 'Only merchant spend transactions can be reversed.' };
    }

    const teen = this.getTeenProfile(tx.teenId);
    const wallet = this.getTeenWallet(tx.teenId);
    if (!wallet) {
      return { success: false, error: 'Linked wallet not found.' };
    }

    // Mark original as reversed
    tx.status = 'reversed';
    tx.reversalReason = reason;

    // Credit money back to teen wallet
    const balanceBefore = wallet.balance;
    wallet.balance += tx.amount;
    wallet.spentToday = Math.max(0, wallet.spentToday - tx.amount);
    wallet.categorySpentMonth[tx.category] = Math.max(
      0,
      (wallet.categorySpentMonth[tx.category] || 0) - tx.amount
    );
    wallet.updatedAt = new Date().toISOString();

    // Create offsetting reversal transaction
    const reversalTx: Transaction = {
      id: 'tx_rev_' + Date.now(),
      familyId: this.state.family.id,
      teenId: tx.teenId,
      teenName: tx.teenName,
      type: 'reversal',
      category: tx.category,
      payeeName: `Refund: ${tx.payeeName}`,
      amount: tx.amount,
      balanceBefore,
      balanceAfter: wallet.balance,
      status: 'success',
      note: `Reversal of #${tx.id}: ${reason}`,
      createdAt: new Date().toISOString(),
    };
    this.state.transactions.unshift(reversalTx);

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'TRANSACTION_REVERSED',
      details: `Reversed ₹${tx.amount} spend at ${tx.payeeName} for ${teen?.name}`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
    return { success: true };
  }

  // GUARDIAN ONBOARDING: Verify Mock Aadhaar
  public verifyGuardianDemoAadhaar(data: {
    maskedAadhaarRef: string;
    maskedName: string;
    dob: string;
    gender: 'Female' | 'Male' | 'Other';
    consentGiven: boolean;
  }) {
    this.state.family.guardianVerified = true;
    this.state.family.verificationDetails = {
      ...data,
      verifiedAt: new Date().toISOString(),
      algorithm: 'Demo-Simulated SHA-256 QR Signature',
    };
    this.state.family.updatedAt = new Date().toISOString();

    this.state.auditLogs.unshift({
      id: 'log_' + Date.now(),
      familyId: this.state.family.id,
      actorId: this.state.family.guardianId,
      actorRole: 'guardian',
      action: 'MOCK_IDENTITY_VERIFIED',
      details: `Guardian completed Demo QR verification (${data.maskedAadhaarRef}) with explicit consent`,
      timestamp: new Date().toISOString(),
    });

    this.notify();
  }
}

export const store = new Store();
