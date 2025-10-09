// // Currency formatter
// const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//   })
  
//   export function formatCurrency(amount: number) {
//     return CURRENCY_FORMATTER.format(amount)
//   }
  
//   // Number formatter (long compact style)
//   const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
//     notation: "compact",
//     compactDisplay: "long",
//   })
  
//   export function formatNumber(number: number) {
//     return NUMBER_FORMATTER.format(number)
//   }
  
//   // Relative time formatter
//   const formatter = new Intl.RelativeTimeFormat(undefined, {
//     numeric: "auto",
//   })
  
//   const DIVISIONS = [
//     { amount: 60, name: "second" },
//     { amount: 60, name: "minute" },
//     { amount: 24, name: "hour" },
//     { amount: 7, name: "day" },
//     { amount: 4.34524, name: "week" },
//     { amount: 12, name: "month" },
//     { amount: Number.POSITIVE_INFINITY, name: "year" },
//   ]
  
//   export function formatTimeAgo(date: Date) {
//     let duration = (date.getTime() - new Date().getTime()) / 1000
  
//     for (let i = 0; i < DIVISIONS.length; i++) {
//       const division = DIVISIONS[i]
//       if (Math.abs(duration) < division.amount) {
//         return formatter.format(Math.round(duration), division.name as Intl.RelativeTimeFormatUnit)
//       }
//       duration /= division.amount
//     }
//   }
  
const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function formatTimeAgo(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  let duration = (date.getTime() - new Date().getTime()) / 1000; // seconds

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name as Intl.RelativeTimeFormatUnit);
    }
    duration /= division.amount;
  }
}