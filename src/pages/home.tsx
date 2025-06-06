import React, { useEffect, useMemo, useState } from "react";
import { apiGetCurrencyConverted } from "../api/currencyApi";
import { Button, InputNumber, Select } from "antd";
import HistoryTable from "./history-table";
import type { DataType } from "../types/history-table";
import { debounce } from "lodash";
import { SwapOutlined } from "@ant-design/icons";

function Home() {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("CNY");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DataType[]>([]);
  const [exchanged, setExchanged] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiGetCurrencyConverted()
      .then((res) => {
        setRates({ EUR: 1, ...res.data.rates }); // EUR为基准
      })
      .finally(() => setLoading(false));
    const local = localStorage.getItem("exchange_history");
    if (local) {
      setHistory(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    if (exchanged && rates[from] && rates[to]) {
      handleConvert();
      setExchanged(false); // 重置
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, exchanged]);

  const handleConvert = () => {
    if (!rates[from] || !rates[to]) {
      setResult(null);
      return;
    }
    const eurAmount = amount / rates[from];
    const converted = eurAmount * rates[to];
    const fixedResult = Number(converted.toFixed(4));
    setResult(fixedResult);

    const record = {
      key: new Date().getTime().toString(),
      time: new Date().toLocaleString(),
      from: `${amount} ${from}`,
      to: `${fixedResult} ${to}`,
    };
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem("exchange_history", JSON.stringify(newHistory));
  };

  const currencyOptions = Object.keys(rates);

  const debouncedConvert = useMemo(
    () => debounce(handleConvert, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rates, amount, from, to, history]
  );

  const handleFromChange = (value: string) => {
    setFrom(value);
    setResult(null);
  };

  const handleToChange = (value: string) => {
    setTo(value);
    setResult(null);
  };

  const exchange = () => {
    setFrom(to);
    setTo(from);
    setExchanged(true);
  };

  const debouncedExchange = useMemo(() => debounce(exchange, 500), [from, to]);

  return (
    <div className="p-8">
      <h2 className="">外币兑换</h2>
      {loading ? (
        <div className="">加载中...</div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <Select value={from} style={{ width: 120 }} onChange={handleFromChange} options={currencyOptions.map((cur) => ({ label: cur, value: cur }))} />
                <InputNumber min={0} max={1000000} value={amount} precision={2} step={1} onChange={(val) => setAmount(Number(val))} />
              </div>
              <span className="mx-2 text-gray-500 flex flex-col items-center">
                {/* <span>兑换</span> */}
                <SwapOutlined style={{ fontSize: "20px", color: "#08c" }} onClick={debouncedExchange} />
              </span>
              <div className="flex flex-col">
                <Select value={to} style={{ width: 120 }} onChange={handleToChange} options={currencyOptions.map((cur) => ({ label: cur, value: cur }))} />
                <InputNumber min={0} max={1000000} value={result !== null ? result : 0} precision={2} step={1} readOnly />
              </div>
              <Button type="primary" onClick={debouncedConvert}>
                兑换
              </Button>
            </div>
          </div>
          <HistoryTable data={history}></HistoryTable>
        </>
      )}
    </div>
  );
}

export default Home;
