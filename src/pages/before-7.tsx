import { Line } from "@ant-design/charts";
import { apiGetCurrencyHistory } from "../api/currencyApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { JudgetExpire } from "../lib/cache-data";
import { CURRENCY_HISTORY } from "../lib/const";

interface Props {
  from: string;
  to: string;
}
function Before7({ from, to }: Props) {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<{ date: string; rate: number }[]>([]);
  useEffect(() => {
    const cacheData = JudgetExpire(from + to + CURRENCY_HISTORY, 60 * 60 * 1000 * 24);
    if (cacheData) {
      setChartData(cacheData.data);
    } else {
      apiGetCurrencyHistory(from, to)
        .then((res) => {
          setChartData(res);
        })
        .catch((err) => {
          console.error("Failed to fetch currency history:", err);
          setChartData([]);
        });
    }
  }, [from, to]);
  return (
    <>
      <Line
        data={chartData}
        xField="date"
        yField="rate"
        point={{ size: 5, shape: "diamond" }}
        xAxis={{
          title: {
            text: t("日期"),
            position: "end",
            style: { fontSize: 14 },
          },
        }}
        yAxis={{
          title: {
            text: `${t(from)} ${t("兑")} ${t(to)}`,
            position: "center",
            style: { fontSize: 14 },
          },
        }}
        height={300}
      />
    </>
  );
}

export default Before7;
