import { calcName, checkKalakinee, calcLifePath, calcZodiac, fullPredictions, type PredictionDetail } from "./numerology";
import type { ResultType } from "../types";

export function getDayIdxFromDate(dateStr: string, wednesdayNight: boolean): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T12:00:00");
  if (isNaN(date.getTime())) return null;
  const map: Record<number, number> = { 0: 0, 1: 1, 2: 2, 3: wednesdayNight ? 4 : 3, 4: 5, 5: 6, 6: 7 };
  return map[date.getDay()] ?? null;
}

export function getNumPred(n: number): PredictionDetail {
  if (n in fullPredictions) return fullPredictions[n as keyof typeof fullPredictions];
  const base = n % 9 || 9;
  return fullPredictions[base as keyof typeof fullPredictions] ?? { title: "", score: 0, text: "", titleAlter: "", scoreAlter: 0, textAlter: "" };
}

export function calcFromParams(fn: string, ln: string, birthDate: string, wednesdayNight: boolean): ResultType | null {
  if (!fn.trim()) return null;
  const fnResult = calcName(fn.trim());
  const lnResult = ln.trim() ? calcName(ln.trim()) : null;
  const total = lnResult ? fnResult.sum + lnResult.sum : fnResult.sum;
  const dayIdx = getDayIdxFromDate(birthDate, wednesdayNight);
  const badInFirst = dayIdx !== null ? checkKalakinee(fn.trim(), dayIdx) : [];
  const badInLast = dayIdx !== null && ln.trim() ? checkKalakinee(ln.trim(), dayIdx) : [];
  let lifePath: number | null = null;
  let zodiac: number | null = null;
  if (birthDate) {
    const parts = birthDate.split("-").map(Number);
    if (parts.length === 3 && parts[0] > 999 && parts[1] > 0 && parts[2] > 0) {
      lifePath = calcLifePath(parts[2], parts[1], parts[0]);
      zodiac = calcZodiac(parts[0]);
    }
  }
  return { fn: fnResult, ln: lnResult, total, dayIdx, badInFirst, badInLast, lifePath, zodiac };
}
