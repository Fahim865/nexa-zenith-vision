export interface CalcField {
  key: string;
  label: string;
  type?: "number" | "date" | "select" | "text";
  def: string | number;
  options?: { value: string; label: string }[];
  suffix?: string;
}

export interface CalcConfig {
  fields: CalcField[];
  compute: (v: Record<string, string>) => [string, string][];
  note?: string;
}

const n = (v: string | undefined) => Number(v ?? 0) || 0;
const money = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const CALC_CONFIGS: Record<string, CalcConfig> = {
  "percentage-calculator": {
    fields: [
      { key: "mode", label: "Calculation", type: "select", def: "of", options: [
        { value: "of", label: "X% of Y" },
        { value: "isof", label: "X is what % of Y" },
        { value: "change", label: "% change from X to Y" },
      ] },
      { key: "x", label: "Value X", def: 25 },
      { key: "y", label: "Value Y", def: 200 },
    ],
    compute: (v) => {
      const x = n(v["x"]), y = n(v["y"]);
      if (v["mode"] === "of") return [["Result", money((x / 100) * y)], ["Reads as", `${x}% of ${y}`]];
      if (v["mode"] === "isof") return [["Result", `${y ? ((x / y) * 100).toFixed(2) : "0"}%`], ["Reads as", `${x} out of ${y}`]];
      const change = x ? ((y - x) / Math.abs(x)) * 100 : 0;
      return [["Change", `${change.toFixed(2)}%`], ["Direction", change >= 0 ? "Increase" : "Decrease"], ["Difference", money(y - x)]];
    },
  },

  "discount-calculator": {
    fields: [
      { key: "price", label: "Original price", def: 120 },
      { key: "pct", label: "Discount %", def: 25 },
      { key: "tax", label: "Tax % (optional)", def: 0 },
    ],
    compute: (v) => {
      const p = n(v["price"]), d = n(v["pct"]), t = n(v["tax"]);
      const save = (p * d) / 100;
      const net = p - save;
      const total = net * (1 + t / 100);
      return [["You pay", money(total)], ["You save", money(save)], ["Price before tax", money(net)]];
    },
  },

  "tip-calculator": {
    fields: [
      { key: "bill", label: "Bill amount", def: 60 },
      { key: "pct", label: "Tip %", def: 15 },
      { key: "people", label: "Split between", def: 2 },
    ],
    compute: (v) => {
      const bill = n(v["bill"]), pct = n(v["pct"]), people = Math.max(1, n(v["people"]));
      const tip = (bill * pct) / 100;
      return [["Tip", money(tip)], ["Total", money(bill + tip)], ["Each person pays", money((bill + tip) / people)]];
    },
  },

  "bmi-calculator": {
    fields: [
      { key: "units", label: "Units", type: "select", def: "metric", options: [
        { value: "metric", label: "Metric (cm / kg)" },
        { value: "imperial", label: "Imperial (in / lb)" },
      ] },
      { key: "height", label: "Height", def: 175 },
      { key: "weight", label: "Weight", def: 70 },
    ],
    note: "BMI is a rough screening measure and doesn't account for muscle mass or body composition.",
    compute: (v) => {
      const h = n(v["height"]), w = n(v["weight"]);
      const bmi = v["units"] === "metric" ? (h ? w / (h / 100) ** 2 : 0) : h ? (703 * w) / h ** 2 : 0;
      const band = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : "Obese";
      return [["BMI", bmi ? bmi.toFixed(1) : "—"], ["Category", bmi ? band : "—"], ["Healthy range", "18.5 – 24.9"]];
    },
  },

  "age-calculator": {
    fields: [{ key: "dob", label: "Date of birth", type: "date", def: "2000-01-01" }],
    compute: (v) => {
      const dob = new Date(String(v["dob"]));
      if (Number.isNaN(dob.getTime())) return [["Age", "—"]];
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (days < 0) { months -= 1; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (months < 0) { years -= 1; months += 12; }
      const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000);
      const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < now) next.setFullYear(next.getFullYear() + 1);
      return [
        ["Age", `${years} yr ${months} mo ${days} d`],
        ["Total days", totalDays.toLocaleString()],
        ["Total weeks", Math.floor(totalDays / 7).toLocaleString()],
        ["Next birthday in", `${Math.ceil((next.getTime() - now.getTime()) / 86400000)} days`],
      ];
    },
  },

  "date-difference": {
    fields: [
      { key: "from", label: "From", type: "date", def: new Date().toISOString().slice(0, 10) },
      { key: "to", label: "To", type: "date", def: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) },
    ],
    compute: (v) => {
      const a = new Date(String(v["from"])), b = new Date(String(v["to"]));
      if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [["Difference", "—"]];
      const days = Math.round((b.getTime() - a.getTime()) / 86400000);
      let workdays = 0;
      const step = new Date(Math.min(a.getTime(), b.getTime()));
      for (let i = 0; i < Math.abs(days); i++) {
        const d = step.getDay();
        if (d !== 0 && d !== 6) workdays++;
        step.setDate(step.getDate() + 1);
      }
      return [
        ["Days", days.toLocaleString()],
        ["Weeks", (days / 7).toFixed(1)],
        ["Months (approx)", (days / 30.44).toFixed(1)],
        ["Working days", workdays.toLocaleString()],
      ];
    },
  },

  "loan-calculator": {
    fields: [
      { key: "amount", label: "Loan amount", def: 20000 },
      { key: "rate", label: "Annual interest %", def: 6.5 },
      { key: "years", label: "Term (years)", def: 5 },
    ],
    compute: (v) => {
      const p = n(v["amount"]), r = n(v["rate"]) / 100 / 12, months = n(v["years"]) * 12;
      const pay = r ? (p * r) / (1 - Math.pow(1 + r, -months)) : months ? p / months : 0;
      const total = pay * months;
      return [["Monthly payment", money(pay)], ["Total repaid", money(total)], ["Total interest", money(total - p)]];
    },
  },

  "interest-calculator": {
    fields: [
      { key: "principal", label: "Starting amount", def: 5000 },
      { key: "rate", label: "Annual interest %", def: 5 },
      { key: "years", label: "Years", def: 10 },
      { key: "monthly", label: "Monthly contribution", def: 100 },
      { key: "freq", label: "Compounded", type: "select", def: "12", options: [
        { value: "1", label: "Yearly" },
        { value: "4", label: "Quarterly" },
        { value: "12", label: "Monthly" },
      ] },
    ],
    compute: (v) => {
      const p = n(v["principal"]), r = n(v["rate"]) / 100, years = n(v["years"]);
      const f = n(v["freq"]) || 12, m = n(v["monthly"]);
      const periods = f * years;
      const rate = r / f;
      const perPeriodContribution = (m * 12) / f;
      const grown = p * Math.pow(1 + rate, periods);
      const contrib = rate ? perPeriodContribution * ((Math.pow(1 + rate, periods) - 1) / rate) : perPeriodContribution * periods;
      const total = grown + contrib;
      const invested = p + m * 12 * years;
      return [["Final balance", money(total)], ["Total invested", money(invested)], ["Interest earned", money(total - invested)]];
    },
  },

  "emi-calculator": {
    fields: [
      { key: "amount", label: "Principal", def: 500000 },
      { key: "rate", label: "Annual interest %", def: 9 },
      { key: "months", label: "Tenure (months)", def: 60 },
    ],
    compute: (v) => {
      const p = n(v["amount"]), r = n(v["rate"]) / 1200, m = n(v["months"]);
      const emi = r ? (p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1) : m ? p / m : 0;
      return [["Monthly EMI", money(emi)], ["Total payable", money(emi * m)], ["Total interest", money(emi * m - p)]];
    },
  },

  "time-calculator": {
    fields: [
      { key: "h1", label: "Hours", def: 2 },
      { key: "m1", label: "Minutes", def: 45 },
      { key: "s1", label: "Seconds", def: 0 },
      { key: "op", label: "Operation", type: "select", def: "add", options: [
        { value: "add", label: "Add" },
        { value: "sub", label: "Subtract" },
      ] },
      { key: "h2", label: "Hours", def: 1 },
      { key: "m2", label: "Minutes", def: 30 },
      { key: "s2", label: "Seconds", def: 0 },
    ],
    compute: (v) => {
      const a = n(v["h1"]) * 3600 + n(v["m1"]) * 60 + n(v["s1"]);
      const b = n(v["h2"]) * 3600 + n(v["m2"]) * 60 + n(v["s2"]);
      const t = v["op"] === "add" ? a + b : a - b;
      const sign = t < 0 ? "-" : "";
      const abs = Math.abs(t);
      const hh = Math.floor(abs / 3600), mm = Math.floor((abs % 3600) / 60), ss = abs % 60;
      return [
        ["Result", `${sign}${hh}h ${mm}m ${ss}s`],
        ["In minutes", `${sign}${(abs / 60).toFixed(2)}`],
        ["In seconds", `${sign}${abs}`],
      ];
    },
  },
};

/* ---------- unit converters ---------- */

export interface UnitConfig {
  units: Record<string, number>;
  defFrom: string;
  defTo: string;
  special?: "temperature";
}

export const UNIT_CONFIGS: Record<string, UnitConfig> = {
  "length-converter": {
    defFrom: "m", defTo: "ft",
    units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, "nautical mile": 1852 },
  },
  "weight-converter": {
    defFrom: "kg", defTo: "lb",
    units: { mg: 1e-6, g: 0.001, kg: 1, tonne: 1000, oz: 0.0283495, lb: 0.453592, stone: 6.35029 },
  },
  "temperature-converter": { defFrom: "°C", defTo: "°F", units: { "°C": 1, "°F": 1, K: 1 }, special: "temperature" },
  "speed-converter": {
    defFrom: "km/h", defTo: "mph",
    units: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, knot: 0.514444, "ft/s": 0.3048 },
  },
  "area-converter": {
    defFrom: "m²", defTo: "ft²",
    units: { "mm²": 1e-6, "cm²": 1e-4, "m²": 1, "km²": 1e6, "in²": 0.00064516, "ft²": 0.092903, "yd²": 0.836127, acre: 4046.86, hectare: 10000 },
  },
  "volume-converter": {
    defFrom: "l", defTo: "gal (US)",
    units: { ml: 0.001, l: 1, "m³": 1000, tsp: 0.00492892, tbsp: 0.0147868, "cup (US)": 0.236588, "pint (US)": 0.473176, "gal (US)": 3.78541, "gal (UK)": 4.54609 },
  },
  "data-storage-converter": {
    defFrom: "MB", defTo: "GB",
    units: { bit: 1 / 8, byte: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4, PB: 1024 ** 5 },
  },
  "time-unit-converter": {
    defFrom: "hour", defTo: "minute",
    units: { millisecond: 0.001, second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600 },
  },
};

export function convertTemperature(value: number, from: string, to: string) {
  const c = from === "°C" ? value : from === "°F" ? ((value - 32) * 5) / 9 : value - 273.15;
  return to === "°C" ? c : to === "°F" ? (c * 9) / 5 + 32 : c + 273.15;
}
