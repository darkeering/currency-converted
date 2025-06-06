import { Table, type TableProps } from "antd";
import type { DataType } from "../types/history-table";

function HistoryTable({ data }: { data: DataType[] }) {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
    },
  ];

  return (
    <>
      <Table<DataType> columns={columns} dataSource={data} />
    </>
  );
}

export default HistoryTable;
