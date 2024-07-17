"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PopoverClose } from "@radix-ui/react-popover";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";

export default function LogHistory() {
  const router = useRouter();
  const session = useSession();
  const [numSlots, setNumSlots] = useState(0);
  const [date, setDate] = useState<Date>();

  interface slotItem {
    id: number;
    hourStart: string;
    minStart: string;
    hourEnd: string;
    minEnd: string;
    activity: string;
    details: string;
  }

  interface logDay {
    id: number;
    vol_id: number;
    Date: string;
    isPocVerified: boolean;
    Logs: slotItem[];
  }

  const { data, loading, error, refetch, abort } = useFetch<logDay>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendence/get/${session.data?.user.auth_id}/${date ? date.getMonth() + 1 : ""}-${date?.getDate()}-${date?.getFullYear()}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session, date],
  );

  return (
    <div className="overflow-x-auto px-1 pt-2">
      <div className="grid grid-cols-1 gap-4 pb-4">
        <div className="grid grid-cols-1 gap-4">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild className=" w-full">
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  " w-full md:w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <PopoverClose>
                <Calendar
                  initialFocus
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                />
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <div>
            <div className=" pb-2">
              {data?.Logs && data?.isPocVerified && (
                <div
                  className=" bg-blue-600 text-gray-100 font-semibold rounded-md px-2 py-2
                             w-full text-center"
                >
                  Verified
                </div>
              )}
              {data?.Logs && !data?.isPocVerified && (
                <div
                  className=" bg-red-500 text-gray-100 font-semibold rounded-md px-2 py-2
                             w-full text-center"
                >
                  Not Verified
                </div>
              )}
            </div>
            <div>
              {data?.Logs?.map((slot, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDaysIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
