import { ColumnDef } from "@tanstack/react-table";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export type slotItem = {
  id: number;
  hourStart: string;
  minStart: string;
  hourEnd: string;
  minEnd: string;
  activity: string;
  details: string;
};

export type logDay = {
  date?: Date;
  slots?: slotItem[];
};

export const columns: ColumnDef<logDay>[] = [
  {
    accessorKey: "date",
    header: "Date",
    meta: {
      align: "left",
    },
    cell: ({ getValue }) => {
      const projectedData = getValue() as Date;
      return <div>{projectedData.toDateString()}</div>;
    },
  },
  {
    accessorKey: "slots",
    header: "Details",
    meta: {
      align: "right",
    },
    cell: ({ getValue }) => {
      const projectedData = getValue() as slotItem[];
      return (
        <Drawer>
          <DrawerTrigger>
            <Button>Details</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerFooter>
              {projectedData.map((slot, index) => (
                <div key={index}>
                  <div className="flex text-pretty">
                    <div className=" text-lg font-semibold">
                      Slot #{index + 1}: {slot.activity} ({slot.hourStart}:
                      {slot.minStart} - {slot.hourEnd}:{slot.minEnd})
                    </div>
                  </div>

                  <div>{slot.details}</div>
                  <div></div>
                </div>
              ))}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];
