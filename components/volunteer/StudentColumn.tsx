import { ColumnDef, CellContext } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { StudentDetails } from "@/components/volunteer/StudentDetails";

export type student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  volId: number;
  cohortId: number;
};

const CellComponent = (row: CellContext<student, unknown>) => {
  const router = useRouter();
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
