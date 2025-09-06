
export interface ITopProduct {
  _id: string;
  name: string;
  revenue: number;
  QuantitySold: number;
  imageURL: string;
}

export interface ISalesByUser {
  _id: string;
  name: string;
  totalSpent: number;
  totalPurchase: number;
  totalUnits: number;
}

export interface IMonthlySale {
  _id: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalQuantitySold: number;
}

export interface ITotalSummary {
  totalSalesAmout: number;
  totalQuantitySold: number;
  numberOfPurchases: number;
}

export interface ISalesReport {
  Total: ITotalSummary[];
  topProducts: ITopProduct[];
  salesByUsers: ISalesByUser[];
  MonthlySales: IMonthlySale[];
}

export interface ISalesReportRes {
  message: string;
  data: ISalesReport[];
}
