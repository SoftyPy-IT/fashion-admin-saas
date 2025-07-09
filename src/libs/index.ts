import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (amount: number) => {
  const formattedPrice = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    currencySign: "standard",
  })
    .format(Math.round(amount))
    .replace("BDT", "Tk")
    .replace(/\s+/g, " ")
    .trim();

  return formattedPrice;
};
