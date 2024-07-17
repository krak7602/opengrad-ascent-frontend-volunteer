import { ColumnDef, CellContext } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { VolunteerDetails } from "@/components/partner/VolunteerDetails";

interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface poc {
  id: number;
}

interface vol {
  id: number;
  poc: poc;
  user_id: user_id;
}

const CellComponent = (row: CellContext<vol, unknown>) => {
  const router = useRouter();
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
