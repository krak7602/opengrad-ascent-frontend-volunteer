import { ColumnDef, CellContext } from "@tanstack/react-table";
import { VolunteerDetails } from "@/components/admin/VolunteerDetails";

interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface vol {
  id: number;
  user_id: user_id;
}

const CellComponent = (row: CellContext<vol, unknown>) => {
  const projectedData = row.getValue() as string;
  return <VolunteerDetails volId={Number(projectedData)} />;
};

export const columns: ColumnDef<vol>[] = [
  {
    accessorKey: "user_id.name",
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
