export interface NameBreakdown {
  ch: string;
  v: number;
}

export interface NameResult {
  sum: number;
  breakdown: NameBreakdown[];
}

export interface ResultType {
  fn: NameResult;
  ln: NameResult | null;
  total: number;
  dayIdx: number | null;
  badInFirst: string[];
  badInLast: string[];
  lifePath: number | null;
  zodiac: number | null;
}
