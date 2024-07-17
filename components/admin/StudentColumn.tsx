import { ColumnDef, CellContext } from "@tanstack/react-table";
import { StudentDetails } from "@/components/admin/StudentDetails";

export type student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  volId: number;
  cohortId: number;
};

const CellComponent = (row: CellContext<student, unknown>) => {
  const projectedData = row.getValue() as string;
  return <StudentDetails studId={projectedData} />;
};

export const columns: ColumnDef<student>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      align: "left",
    },
    cell: ({ getValue }) => {
      const projectedData = getValue() as string;
      return <div>{projectedData}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Details",
    meta: {
      align: "right",
    },
    cell: CellComponent,
  },
];
