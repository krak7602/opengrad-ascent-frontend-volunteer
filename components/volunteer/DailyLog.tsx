"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  CollapsibleTrigger,
  CollapsibleContent,
  Collapsible,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { PopoverClose } from "@radix-ui/react-popover";
import LogField from "@/components/volunteer/LogField";
import { useToast } from "@/components/ui/use-toast";
import { useListState } from "@mantine/hooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import LogHistory from "@/components/volunteer/LogHistory";

export default function DailyLog() {
  const router = useRouter();
  const session = useSession();
  const [numSlots, setNumSlots] = useState(0);
  const [formData, setFormData] = useListState<slotItem>([]);
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  interface slotItem {
    id: number;
    hourStart: string;
    minStart: string;
    hourEnd: string;
    minEnd: string;
    activity: string;
    details: string;
  }

  const handleSlotFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    field: string,
  ) => {
    if (field === "details") {
      setFormData.setItem(index, {
        ...formData[index],
        details: e.target.value,
      });
    }
  };

  const handleTimeChange = (
    value: string,
    index: number,
    field: string,
    pos: string,
  ) => {
    if (pos === "start") {
      if (formData) {
        if (field === "hour") {
          setFormData.setItem(index, { ...formData[index], hourStart: value });
        } else if (field == "min") {
          setFormData.setItem(index, { ...formData[index], minStart: value });
        }
      }
    } else if (pos === "end") {
      if (formData) {
        if (field === "hour") {
          setFormData.setItem(index, { ...formData[index], hourEnd: value });
        } else if (field == "min") {
          setFormData.setItem(index, { ...formData[index], minEnd: value });
        }
      }
    }
  };
  const handleIncreaseSlots = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    activity: string,
  ) => {
    if (numSlots === 0) {
      setFormData.setState([
        {
          id: numSlots,
          hourStart: "--",
          minStart: "--",
          hourEnd: "--",
          minEnd: "--",
          activity: activity,
          details: "",
        },
      ]);
      setNumSlots(numSlots + 1);
    } else {
      setFormData.append({
        id: numSlots,
        hourStart: "--",
        minStart: "--",
        hourEnd: "--",
        minEnd: "--",
        activity: activity,
        details: "",
      });
      setNumSlots(numSlots + 1);
    }
  };
  const handleDecreaseSlots = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (numSlots > 0) {
      setFormData.pop();
      setNumSlots(numSlots - 1);
    }
  };

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData && date) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendence/create`,
          {
            vol_id: session.data?.user.auth_id,
            Date: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
            Logs: formData,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
    toast({
      description: "Your form has been submitted successfully",
    });
    setDate(undefined);
    setNumSlots(0);
    setFormData.setState([]);
  };

  return (
    <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 pb-4">
        <h1 className="text-2xl pb-1 font-bold">Daily Log</h1>
      </div>
      <Tabs defaultValue="new-log" className="w-full">
        <TabsList>
          <TabsTrigger value="new-log">New Log</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="new-log">
          <div className="overflow-x-auto px-1 pt-2">
            <form onSubmit={formSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                <div className="grid grid-cols-1 gap-4">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant={"outline"}
                        className={cn(
                          " w-full md:w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
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
                </div>
              </div>
              {date && (
                <div>
                  {formData?.map((slot, index) => (
                    <Collapsible key={index} defaultOpen className="gap-6">
                      <CollapsibleTrigger className="flex w-full items-center justify-between text-lg font-semibold [&[data-state=open]>svg]:rotate-90">
                        Slot #{index + 1}: {slot.activity}
                        <ChevronRightIcon className="ml-auto h-5 w-5 transition-all" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <LogField
                          handleSlotFieldChange={handleSlotFieldChange}
                          handleTimeChange={handleTimeChange}
                          index={index}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                  <div className="flex">
                    {numSlots > 0 && (
                      <Button
                        type="button"
                        className="mr-3 flex items-center justify-center gap-2 bg-destructive hover:bg-destructive text-white hover:text-white"
                        onClick={(e) => {
                          handleDecreaseSlots(e);
                        }}
                        variant="outline"
                      >
                        <RemoveIcon className="h-4 w-4 text-white" />
                        Delete Slot
                      </Button>
                    )}
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          type="button"
                          className="flex items-center justify-center gap-2"
                          variant="outline"
                        >
                          <PlusIcon className="h-4 w-4 text-black" />
                          Add Slot
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 flex flex-wrap">
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Content Creation");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Content Creation
                        </PopoverClose>
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Tech");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Tech
                        </PopoverClose>
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Mentoring");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Mentoring
                        </PopoverClose>
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Marketing");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Design/Marketing
                        </PopoverClose>
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Offline Outreach");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Offline Outreach
                        </PopoverClose>
                        <PopoverClose
                          onClick={(e) => {
                            handleIncreaseSlots(e, "Other");
                          }}
                          className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          Other
                        </PopoverClose>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
              <div>
                <Button type="submit" className="my-2">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <LogHistory />
        </TabsContent>
      </Tabs>
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

function ChevronRightIcon(props: { className: string }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill={"none"}
    {...props}
  >
    <path
      d="M12 4V20M20 12H4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RemoveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill={"none"}
    {...props}
  >
    <path
      d="M20 12L4 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
