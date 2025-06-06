import { Table, type TableProps } from "antd";
import type { DataType } from "../types/history-table";
import { useTranslation } from "react-i18next";

function HistoryTable({ data }: { data: DataType[] }) {
  const { t } = useTranslation();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("Time"),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t("From"),
      dataIndex: "from",
      key: "from",
      render: (_text, record) => `${record.amount} ${t(record.from)}`,
    },
    {
      title: t("To"),
      dataIndex: "to",
      key: "to",
      render: (_text, record) => `${record.result} ${t(record.to)}`,
    },
  ];

  return (
    <>
      <Table<DataType> columns={columns} dataSource={data} />
    </>
  );
}

export default HistoryTable;
