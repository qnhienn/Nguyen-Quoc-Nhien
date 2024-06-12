import { TokenPriceItem } from "./type/token";

const BASE_URL = "https://interview.switcheo.com/prices.json";

export const tokenApi = {
  getTokenPrices() {
    return fetch(BASE_URL).then(async (res) =>
      res.ok ? ((await res.json()) as TokenPriceItem[]) : []
    );
  },
};

export type { TokenPriceItem };
