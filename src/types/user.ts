export type UserType = 'salesman' | 'store_manager' | 'zonal_manager';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  organization: string;
  userType: UserType;
  storeName?: string;
  zoneName?: string;
}

export interface CreateUserData {
  name: string;
  phoneNumber: string;
  organization: string;
  userType: UserType;
  storeName?: string;
  zoneName?: string;
}

export interface LoginData {
  name: string;
  phoneNumber: string;
}

export interface Analytics {
  totalSales: number;
  conversions: number;
  lostSales: number;
  conversionRate: number;
  commonObjections: string[];
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface SalesSession {
  id: string;
  userId: string;
  customerName: string;
  customerNumber: string;
  transcript: string;
  timestamp: string;
}