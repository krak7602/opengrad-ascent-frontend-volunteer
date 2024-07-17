import * as React from "react";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";

interface poc_user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface poc {
  id: number;
  user_id: poc_user_id;
}

export function AddCohort() {
  const session = useSession();
  const [open, setOpen] = React.useState(false);
  const [orgName, setOrgName] = React.useState("");
  const [fromDate, setFromDate] = React.useState<Date>();
  const [toDate, setToDate] = React.useState<Date>();
  const [recipientPartners, setRecipientPartners] = useListState<poc>([]);
  const [recipientPartnerCount, setRecipientPartnerCount] = useState(0);
  const [send, setSend] = useState(false);
  const { data, loading, error, refetch, abort } = useFetch<poc[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pocs = recipientPartners.map((element) => element.id);
    try {
      if (fromDate && toDate && orgName !== "") {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/create`,
          {
            name: orgName,
            startDate: `${fromDate.getDate()}-${fromDate.getMonth() + 1}-${fromDate.getFullYear()}`,
            endDate: `${toDate.getDate()}-${toDate.getMonth() + 1}-${toDate.getFullYear()}`,
            poc: pocs,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
        if (resp.data.id) {
          setSend(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const AddPartner = (selectedPartner: string) => {
    let found = false;
    recipientPartners?.forEach((element) => {
      if (element.user_id.name === selectedPartner) found = true;
    });
    if (!found && data) {
      data.forEach((element) => {
        if (element.user_id.name === selectedPartner) {
          setRecipientPartners.append(element);
          setRecipientPartnerCount(recipientPartnerCount + 1);
        }
      });
    }
  };

  const RemovePartner = (id: number) => {
    setRecipientPartners.remove(id);
    setRecipientPartnerCount(recipientPartnerCount - 1);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Cohort</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Cohort</DrawerTitle>
        </DrawerHeader>
        <div>
          {send && (
            <div className=" flex flex-col items-center gap-3">
              <CheckmarkCircleIcon className=" text-primary" />
              <div>New cohort has been created successfully.</div>
            </div>
          )}
          {!send && (
            <div className=" px-4">
              <form onSubmit={onSubmit} className="grid items-start gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Cohort Name</Label>
                  <Input
                    type="text"
                    id="name"
                    onChange={(e) => {
                      setOrgName(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <Label htmlFor="startdate">Start Date</Label>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <Label htmlFor="enddate">End Date</Label>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Calendar
                          initialFocus
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <Label htmlFor="members">Members</Label>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {recipientPartners?.map((value, index) => (
                              <div
                                key={index}
                                className="bg-gray-500 text-white rounded-sm text-xs font-semibold px-1 flex flex-row items-center"
                              >
                                <div>{value.user_id.name}</div>
                                <CancelIcon
                                  onClick={() => RemovePartner(index)}
                                  className=" w-3 h-3 ml-1 text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <Command>
                          <CommandInput placeholder="Add Member Organization" />
                          <CommandList>
                            <CommandEmpty>No recipient found.</CommandEmpty>
                            <CommandGroup className=" overflow-y-auto h-32 lg:h-56">
                              {data && data.constructor === Array && (
                                <div>
                                  {data.map((partner) => (
                                    <CommandItem
                                      key={partner.id}
                                      value={partner.user_id.name}
                                      onSelect={(currentValue) => {
                                        AddPartner(currentValue);
                                      }}
                                    >
                                      {partner.user_id.name}
                                    </CommandItem>
                                  ))}
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <Button type="submit">Add</Button>
              </form>
            </div>
          )}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const CheckmarkCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 12.5C8 12.5 9.5 12.5 11.5 16C11.5 16 17.0588 6.83333 22 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CancelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M19.0005 4.99988L5.00045 18.9999M5.00045 4.99988L19.0005 18.9999"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
