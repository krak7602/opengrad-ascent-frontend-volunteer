import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type partnerColumn = {
  id: string;
  name: string;
};

interface poc {
  id: number;
  user_id: user_id;
}

interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CellComponent = (row: CellContext<poc, unknown>) => {
  const router = useRouter();
  const pushPage = (id: string) => {
    router.push(`/partners/${id}`);
  };
  const projectedData = row.getValue() as string;
  return (
    <Button
      onClick={() => {
        pushPage(projectedData);
      }}
    >
      Details
    </Button>
  );
};

export const columns: ColumnDef<poc>[] = [
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
