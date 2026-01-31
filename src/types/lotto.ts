/** 동행복권 API 당첨 회차 한 건 (selectPstLt645Info 응답 항목) */
export interface LottoDrawRaw {
  ltEpsd: number;
  ltRflYmd: string; // YYYYMMDD
  tm1WnNo: number;
  tm2WnNo: number;
  tm3WnNo: number;
  tm4WnNo: number;
  tm5WnNo: number;
  tm6WnNo: number;
  bnsWnNo: number;
  rnk1WnNope?: number;
  rnk1WnAmt?: number;
  [key: string]: unknown;
}

/** 프론트에서 쓰기 쉬운 당첨 회차 (6개 번호 + 보너스 배열) */
export interface LottoDraw {
  ltEpsd: number;
  ltRflYmd: string;
  numbers: [number, number, number, number, number, number];
  bonus: number;
}

export interface LottoHistoryApiResponse {
  resultCode: string | null;
  resultMessage: string | null;
  data: {
    list: LottoDrawRaw[];
  };
}
