import React, { KeyboardEvent, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { TokenPriceItem, tokenApi } from "../service/api";
import { getTokenIcon } from "../utils/helper";
import { LoadingIcon } from "./Icons";

type Option = {
  label: React.ReactNode;
  value: string;
  price: number;
};

function FancyForm() {
  const [prices, setPrices] = useState<TokenPriceItem[]>([]);
  const [inputToken, setInputToken] = useState<Option | null>();
  const [outputToken, setOutputToken] = useState<Option | null>();
  const [input, setInput] = useState<string>();
  const [output, setOutput] = useState<string>();
  const [errMsg, setErrMsg] = useState<string>();
  const [loading, setLoading] = useState(false);

  const options = useMemo(() => {
    return prices.map<Option>((item) => ({
      label: (
        <div className="flex gap-2 items-center">
          <img
            src={getTokenIcon(item.currency)}
            alt={item.currency}
            width={20}
            height={20}
          />
          <span>{item.currency}</span>
        </div>
      ),
      value: item.currency,
      price: item.price,
    }));
  }, [prices]);

  const handleSwap = () => {
    if (!inputToken?.price) {
      setErrMsg("Please select input token");
      return;
    }
    if (!outputToken?.price) {
      setErrMsg("Please select output token");
      return;
    }
    if (!input || isNaN(Number(input))) {
      setErrMsg("Please input amount to send with a valid number");
      return;
    }

    setLoading(true);
    setErrMsg(undefined);
    // Fake call api
    setTimeout(() => {
      const outputPrice =
        (Number(input) * outputToken.price) / inputToken.price;
      setOutput(Number.parseFloat(outputPrice.toFixed(9)).toString());
      setLoading(false);
    }, 1000);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSwap();
    }
  };

  useEffect(() => {
    tokenApi.getTokenPrices().then((data) => {
      const uniqueMap: Record<string, TokenPriceItem> = {};
      data.forEach((item) => {
        if (!uniqueMap[item.currency]) {
          uniqueMap[item.currency] = item;
        }
      });
      setPrices(Object.values(uniqueMap));
    });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center sm:px-0 px-4">
      <div className="max-w-[400px] w-full p-4 rounded-lg border border-slate-200 flex flex-col gap-5">
        <h5 className="text-center text-lg font-bold text-rose-500">Swap</h5>
        <div>
          <label className="text-sm font-semibold" htmlFor="input-amount">
            Amount to send
          </label>
          <div className="flex mt-1">
            <input
              id="input-amount"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-[38px] rounded-md border-slate-200 border px-4 focus:outline-none rounded-r-none border-r-0 w-[calc(100%-144px)]"
              onKeyDown={handleInputKeyDown}
            />
            <Select
              options={options}
              value={inputToken}
              onChange={(v) => setInputToken(v)}
              className="w-36 shrink-0 [&>div]:rounded-l-none [&>div]:border-slate-200"
              placeholder="Token"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="output-amount">
            Amount to receive
          </label>
          <div className="flex mt-1">
            <input
              id="output-amount"
              readOnly
              type="text"
              value={output}
              className="h-[38px] rounded-md border-slate-200 border px-4 focus:outline-none rounded-r-none border-r-0 w-[calc(100%-144px)]"
            />
            <Select
              options={options}
              value={outputToken}
              onChange={(v) => setOutputToken(v)}
              className="w-36 shrink-0 [&>div]:rounded-l-none [&>div]:border-slate-200"
              placeholder="Token"
            />
          </div>
        </div>

        <div>
          {errMsg && (
            <p className="text-sm text-red-500 font-semibold">{errMsg}</p>
          )}
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-1.5 rounded-md bg-teal-500 font-semibold text-sm text-white hover:bg-teal-600 
                transition-all flex items-center gap-2"
              onClick={handleSwap}
              disabled={loading}
            >
              {loading && (
                <LoadingIcon className="text-lg text-slate-200 animate-spin" />
              )}
              CONFIRM SWAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FancyForm;
