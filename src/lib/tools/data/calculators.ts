import {
  Calculator,
  FlaskConical,
  Percent,
  Tag,
  HandCoins,
  HeartPulse,
  CalendarDays,
  CalendarRange,
  Landmark,
  PiggyBank,
  Receipt,
  Timer,
  Ruler,
  Weight,
  Thermometer,
  Gauge,
  Square,
  Beaker,
  HardDrive,
  Clock,
} from "lucide-react";
import { def } from "./def";
import type { ToolMeta } from "../types";

const calc = { category: "calculators", provider: "device", credits: 0, inputType: "number", outputType: "number" } as const;
const conv = { category: "converters", provider: "device", credits: 0, inputType: "number", outputType: "number" } as const;

export const CALCULATOR_TOOLS: ToolMeta[] = [
  def({ ...calc, name: "Calculator", slug: "calculator", description: "A fast everyday calculator with keyboard support and history.", icon: Calculator, tags: ["math", "arithmetic", "basic"], status: "live", featured: true, popular: true }),
  def({ ...calc, name: "Scientific Calculator", slug: "scientific-calculator", description: "Trigonometry, logarithms, powers and constants in one panel.", icon: FlaskConical, tags: ["scientific", "trig", "log", "math"], status: "live" }),
  def({ ...calc, name: "Percentage Calculator", slug: "percentage-calculator", description: "Work out percentages, increases, decreases and differences.", icon: Percent, tags: ["percent", "increase", "difference"], status: "live", popular: true }),
  def({ ...calc, name: "Discount Calculator", slug: "discount-calculator", description: "See the sale price and how much you save on any discount.", icon: Tag, tags: ["sale", "discount", "shopping"], status: "live" }),
  def({ ...calc, name: "Tip Calculator", slug: "tip-calculator", description: "Split the bill and work out the tip per person.", icon: HandCoins, tags: ["tip", "bill", "split", "restaurant"], status: "live" }),
  def({ ...calc, name: "BMI Calculator", slug: "bmi-calculator", description: "Body mass index from your height and weight, metric or imperial.", icon: HeartPulse, tags: ["bmi", "health", "weight", "fitness"], status: "live", popular: true }),
  def({ ...calc, name: "Age Calculator", slug: "age-calculator", description: "Your exact age in years, months, days — and days until your next birthday.", icon: CalendarDays, tags: ["age", "birthday", "date"], status: "live", popular: true }),
  def({ ...calc, name: "Date Difference Calculator", slug: "date-difference", description: "Count the days, weeks and months between two dates.", icon: CalendarRange, tags: ["date", "days between", "duration"], status: "live" }),
  def({ ...calc, name: "Loan Calculator", slug: "loan-calculator", description: "Monthly repayment, total interest and total cost of a loan.", icon: Landmark, tags: ["loan", "mortgage", "repayment", "finance"], status: "live" }),
  def({ ...calc, name: "Compound Interest Calculator", slug: "interest-calculator", description: "See how savings grow with compound interest over time.", icon: PiggyBank, tags: ["interest", "savings", "compound", "investment"], status: "live" }),
  def({ ...calc, name: "EMI Calculator", slug: "emi-calculator", description: "Equated monthly instalment, interest paid and total payable.", icon: Receipt, tags: ["emi", "instalment", "loan"], status: "live" }),
  def({ ...calc, name: "Time Calculator", slug: "time-calculator", description: "Add or subtract hours, minutes and seconds.", icon: Timer, tags: ["time", "hours", "duration"], status: "live" }),
];

export const CONVERTER_TOOLS: ToolMeta[] = [
  def({ ...conv, name: "Length Converter", slug: "length-converter", description: "Convert between metres, feet, inches, miles and more.", icon: Ruler, tags: ["length", "metres", "feet", "inches"], status: "live", popular: true }),
  def({ ...conv, name: "Weight Converter", slug: "weight-converter", description: "Convert kilograms, pounds, ounces, stones and tonnes.", icon: Weight, tags: ["weight", "mass", "kg", "lbs"], status: "live" }),
  def({ ...conv, name: "Temperature Converter", slug: "temperature-converter", description: "Celsius, Fahrenheit and Kelvin, converted instantly.", icon: Thermometer, tags: ["temperature", "celsius", "fahrenheit"], status: "live" }),
  def({ ...conv, name: "Speed Converter", slug: "speed-converter", description: "Convert km/h, mph, m/s, knots and more.", icon: Gauge, tags: ["speed", "kmh", "mph", "knots"], status: "live" }),
  def({ ...conv, name: "Area Converter", slug: "area-converter", description: "Square metres, feet, acres, hectares and more.", icon: Square, tags: ["area", "acres", "hectares"], status: "live" }),
  def({ ...conv, name: "Volume Converter", slug: "volume-converter", description: "Litres, gallons, cups, millilitres and cubic measures.", icon: Beaker, tags: ["volume", "litres", "gallons"], status: "live" }),
  def({ ...conv, name: "Data Storage Converter", slug: "data-storage-converter", description: "Bytes, kilobytes, megabytes, gigabytes and terabytes.", icon: HardDrive, tags: ["data", "mb", "gb", "storage"], status: "live" }),
  def({ ...conv, name: "Time Unit Converter", slug: "time-unit-converter", description: "Seconds, minutes, hours, days, weeks and years.", icon: Clock, tags: ["time", "seconds", "hours"], status: "live" }),
];
