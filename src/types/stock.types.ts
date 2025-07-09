import { IBrand, ICategory } from "./product.types";

export interface IStock {
  startDate: Date;
  endDate: Date;
  reference: string;
  type: "Partial" | "Full";
  brands?: IBrand[];
  categories?: ICategory[];
  initialStockCSV: {
    url: string;
    publicId: string;
  };
  finalStockCSV?: {
    url: string;
    publicId: string;
  };
  isFinalCalculation: boolean;
  counts: {
    no: number;
    description: string;
    expected: number;
    counted: number;
    difference: number;
    cost: number;
  }[];
  note?: string;
  totalDifference?: number;
  totalCost?: number;
}
