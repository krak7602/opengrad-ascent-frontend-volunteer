import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface notif {
  id: number;
  typeofnotification: "form";
  Message: string;
  form_id: number;
  receipient_id: number[];
}

const CellComponent = (row: CellContext<notif, unknown>) => {
  const router = useRouter();
  // row.table.
  const pushPage = (id: string) => {
    router.push(`/feedback/responses/${id}?title=${row.row.original.Message}`);
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

export const columns: ColumnDef<notif>[] = [
  {
    accessorKey: "Message",
    header: "Message",
    meta: {
      align: "left",
    },
    cell: ({ getValue }) => {
      const projectedData = getValue() as string;
      return <div>{projectedData}</div>;
    },
  },
  {
    accessorKey: "form_id",
    header: "Details",
    meta: {
      align: "right",
    },
    cell: CellComponent,
  },
];
