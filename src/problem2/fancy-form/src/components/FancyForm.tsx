import React, { useEffect, useState } from "react";
import Select from "react-select";
import { TokenPriceItem, tokenApi } from "../service/api";
import { getTokenIcon } from "../utils/helper";

type Option = {
  label: React.ReactNode;
  value: string;
  price: number;
};

function FancyForm() {
  const [prices, setPrices] = useState<TokenPriceItem[]>([]);
  const [fromToken, setFromToken] = useState<Option | null>();

  const options = prices.map<Option>((item) => ({
    label: (
      <div className="flex gap-2 items-center">
        <img src={getTokenIcon(item.currency)} alt="" width={20} height={20} />
        <span>{item.currency}</span>
      </div>
    ),
    value: item.currency,
    price: item.price,
  }));

  useEffect(() => {
    tokenApi.getTokenPrices().then((data) => {
      setPrices(data);
    });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-[400px] p-4 rounded-lg shadow-lg">
        <h2 className="text-center text-lg font-bold text-rose-500 mb-5">
          Token swap
        </h2>
        <div className="flex">
          <input
            type="text"
            placeholder="Price"
            className="h-[38px] rounded-md border-slate-200 border px-4 focus:outline-none rounded-r-none border-r-0 grow"
          />
          <Select
            options={options}
            value={fromToken}
            onChange={(v) => setFromToken(v)}
            className="w-36 [&>div]:rounded-l-none [&>div]:border-slate-200"
            placeholder="Token"
          />
        </div>

        <div className="flex mt-5">
          <input
            type="text"
            placeholder="Price"
            className="h-[38px] rounded-md border-slate-200 border px-4 focus:outline-none rounded-r-none border-r-0 grow"
          />
          <Select
            options={options}
            value={fromToken}
            onChange={(v) => setFromToken(v)}
            className="w-36 [&>div]:rounded-l-none [&>div]:border-slate-200"
            placeholder="Token"
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button className="px-4 py-1.5 rounded-md bg-teal-500 font-semibold text-sm text-white hover:bg-teal-600 transition-all">
            Swap
          </button>
        </div>
      </div>
    </div>
  );
}

export default FancyForm;
