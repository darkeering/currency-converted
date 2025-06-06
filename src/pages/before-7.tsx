import { Line } from "@ant-design/charts";
import { apiGetCurrencyHistory } from "../api/currencyApi";
import { useEffect, useState } from "react";

interface Props {
  from: string;
  to: string;
}
function Before7({ from, to }: Props) {
  const [chartData, setChartData] = useState<{ date: string; rate: number }[]>([]);
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const format = (d: Date) => d.toISOString().slice(0, 10);

    apiGetCurrencyHistory(from, to, format(start), format(end)).then((res) => {
      const rates = res.data.rates;
      const data = Object.keys(rates).map((date) => ({
        date,
        rate: rates[date][to],
      }));
      setChartData(data);
    });
  }, [from, to]);
  return (
    <>
      <Line data={chartData} xField="date" yField="rate" point={{ size: 5, shape: "diamond" }} xAxis={{ title: { text: "日期" } }} yAxis={{ title: { text: `${from}兑${to}` } }} height={300} />
    </>
  );
}

export default Before7;
