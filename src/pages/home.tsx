import React, { useEffect, useMemo, useState } from "react";
import { apiGetCurrencyConverted } from "../api/currencyApi";
import { Button, InputNumber, Select } from "antd";
import HistoryTable from "./history-table";
import type { DataType } from "../types/history-table";
import { debounce } from "lodash";
import { SwapOutlined } from "@ant-design/icons";
import Before7 from "./before-7";
import { useTranslation } from "react-i18next";
import { JudgetExpire } from "../lib/cache-data";
import { CURRENCY_RATES_CACHE } from "../lib/const";

function Home() {
  const { t, i18n } = useTranslation();
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("CNY");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DataType[]>([]);

  useEffect(() => {
    const cacheData = JudgetExpire(CURRENCY_RATES_CACHE);
    if (cacheData) {
      setRates(cacheData.data);
      setLoading(false);
    } else {
      setLoading(true);
      apiGetCurrencyConverted()
        .then((res) => {
          setRates(res);
        })
        .catch((err) => {
          console.error("Failed to fetch currency rates:", err);
          setRates({});
        })
        .finally(() => setLoading(false));
    }

    const local = localStorage.getItem("exchange_history");
    if (local) {
      setHistory(JSON.parse(local));
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    handleConvert();
  }, [amount, from, to, loading]);

  const handleConvert = () => {
    if (!rates[from] || !rates[to]) {
      setResult(0);
      return;
    }
    const eurAmount = amount / rates[from];
    const converted = eurAmount * rates[to];
    const fixedResult = Number(converted.toFixed(4));
    setResult(fixedResult);

    const record = {
      key: new Date().getTime().toString(),
      time: new Date().toLocaleString(),
      amount,
      from,
      result: fixedResult,
      to,
    };
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem("exchange_history", JSON.stringify(newHistory));
  };

  const currencyOptions = Object.keys(rates);

  const handleAmountChange = (value: number | null) => {
    if (value !== null) {
      setAmount(value);
    }
  };

  const debouncedSetAmmount = useMemo(() => debounce(handleAmountChange, 250), [amount, from, to]);

  const handleFromChange = (value: string) => {
    setFrom(value);
  };

  const handleToChange = (value: string) => {
    setTo(value);
  };

  const exchange = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="p-8">
      <div className="flex justify-end mb-4">
        <Button onClick={() => i18n.changeLanguage("zh")}>中文</Button>
        <Button onClick={() => i18n.changeLanguage("en")}>English</Button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">{t("Currency Converted")}</h2>
      {loading ? (
        <div className="text-center text-gray-500">{t("loading...")}</div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              {amount.toFixed(2)} {t(from)} =
              <br />
              {result.toFixed(2)} {t(to)}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Select value={from} style={{ width: 140 }} onChange={handleFromChange} options={currencyOptions.map((cur) => ({ label: t(cur), value: cur }))} className="mb-2" />
                <InputNumber min={0} max={1000000} value={amount} precision={2} step={1} onChange={debouncedSetAmmount} style={{ width: 140 }} className="!rounded !border-gray-300" />
              </div>
              <span className="mx-2 flex flex-col items-center">
                <SwapOutlined style={{ fontSize: "24px", color: "#2563eb", cursor: "pointer" }} onClick={exchange} />
              </span>
              <div className="flex flex-col items-center">
                <Select value={to} style={{ width: 140 }} onChange={handleToChange} options={currencyOptions.map((cur) => ({ label: t(cur), value: cur }))} className="mb-2" />
                <InputNumber min={0} max={1000000} value={result !== null ? result : 0} precision={2} step={1} readOnly style={{ width: 140 }} className="!rounded !border-gray-300 bg-gray-50" />
              </div>
            </div>
          </div>
          <HistoryTable data={history}></HistoryTable>
          <Before7 from={from} to={to}></Before7>
        </>
      )}
    </div>
  );
}

export default Home;
