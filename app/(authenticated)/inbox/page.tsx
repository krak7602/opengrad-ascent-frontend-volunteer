"use client";
import { useState } from "react";
import { useListState } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/lib/useFetch";
import { NotificationTable } from "@/components/volunteer/NotificationTable";
import { columns } from "@/components/volunteer/NotificationColumn";
import { useQuery } from "@tanstack/react-query";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import Refetching from "@/components/Refetching";
import { useQueryClient } from "@tanstack/react-query";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();
  const queryClient = useQueryClient();

  interface vol {
    id: number;
  }

  interface Cohorts {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    vol: vol[];
  }

  interface poc {
    id: number;
  }

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface Poc {
    id: number;
    user_id: user_id;
    poc: poc;
  }

  interface studentInfo {
    Poc: Poc;
    Cohorts: Cohorts[];
  }

  const volFulData = useQuery<studentInfo>({
    queryKey: ["volData"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/volfuldata`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return await response.json();
    },
    refetchInterval: 10000,
    staleTime: 60000,
    enabled: !!session.data?.user.auth_token,
    refetchOnMount: true,
  });
  // const volFulData = useFetch<studentInfo>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/volfuldata`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );

  const [recipientCohortCount, setRecipientCohortCount] = useState(0);
  const [recipientPartnerCount, setRecipientPartnerCount] = useState(1);
  const [recipientCohorts, setRecipientCohorts] = useListState<Cohorts>([]);
  const [open, setOpen] = useState(false);
  const [cohortAdd, setCohortAdd] = useState(false);
  const [partnerAdd, setPartnerAdd] = useState(true);

  const AddCohort = async (selectedCohort: Cohorts) => {
    if (volFulData.data?.Cohorts) {
      volFulData.data.Cohorts.forEach((element) => {
        if (element.name === selectedCohort.name) {
          setRecipientCohorts.setState([element]);
          setRecipientCohortCount(1);
          setRecipientPartnerCount(0);
        }
      });
    }
  };

  const toggleClick = (option: string) => {
    if (option === "cohorts") {
      setCohortAdd(!cohortAdd);
      setPartnerAdd(false);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartnerCount(0);
    } else if (option === "partners") {
      setCohortAdd(false);
      setPartnerAdd(!partnerAdd);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartnerCount(1);
      queryClient.invalidateQueries({
        queryKey: ["notifDataPoc"],
      });
    }
  };

  interface notif {
    id: number;
    typeofnotification: "form";
    Message: string;
    form_id: number;
    receipient_id: number[];
  }

  const notifDataCohort = useQuery<notif[]>({
    queryKey: ["notifDataCohort"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return await response.json();
    },
    refetchInterval: 10000,
    staleTime: 60000,
    enabled: !!session.data?.user.auth_token,
    refetchOnMount: true,
  });

  // const notifDataCohort = useFetch<notif[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/get/${recipientCohorts[0]?.id}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //   },
  //   [session],
  // );

  const notifDataPoc = useQuery<notif[]>({
    queryKey: ["notifDataPoc"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${volFulData?.data?.Poc?.poc?.id}`,
        {
          headers: {
            authorization: `Bearer ${session.data?.user.auth_token}`,
          },
        },
      );
      return await response.json();
    },
    refetchInterval: 10000,
    staleTime: 60000,
    enabled: !!session.data?.user.auth_token,
    refetchOnMount: true,
  });

  // const notifDataPoc = useFetch<notif[]>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/get/${volFulData?.data?.Poc?.poc?.id}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //   },
  //   [session],
  // );

  return (
    <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-2">
        <h1 className="text-2xl pb-6 font-bold">Inbox</h1>
      </div>
      <div className="overflow-x-auto px-1 pt-2">
        <div className="flex w-full flex-col items-start rounded-md border px-1 py-1">
          <div className="flex w-full flex-row px-1 py-1 items-center justify-between">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={partnerAdd}>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="lg:w-fit w-full font-light py-3 rounded-lg px-3 flex justify-center items-center mr-2"
                >
                  <div className="mx-2">
                    {recipientCohortCount != 0 && (
                      <div>{recipientCohorts[0]?.name}</div>
                    )}
                    {recipientCohortCount == 0 && <div>Select recipient</div>}
                  </div>
                </Button>
              </PopoverTrigger>
              {cohortAdd && (
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Add Recipient" />
                    <CommandList>
                      <CommandEmpty>No recipient found.</CommandEmpty>
                      <CommandGroup>
                        {volFulData.data?.Cohorts &&
                          volFulData.data.Cohorts.constructor === Array && (
                            <div>
                              {volFulData.data.Cohorts.map((cohort) => (
                                <CommandItem
                                  key={cohort.id}
                                  value={cohort.name}
                                  onSelect={(currentValue) => {
                                    AddCohort(cohort).then(() => {
                                      queryClient.invalidateQueries({
                                        queryKey: ["notifDataCohort"],
                                      });
                                    });
                                    setOpen(false);
                                  }}
                                >
                                  {cohort.name}
                                </CommandItem>
                              ))}
                            </div>
                          )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
            <ToggleGroup
              type="single"
              defaultValue="partners"
              className=" ml-1 gap-0 rounded bg-slate-200"
            >
              <ToggleGroupItem
                className=" px-2 font-light rounded-l-sm rounded-r-none data-[state=on]:bg-primary data-[state=on]:text-white"
                onClick={() => toggleClick("partners")}
                value="partners"
              >
                <div className=" text-xs">Partner</div>
              </ToggleGroupItem>
              <ToggleGroupItem
                className=" px-2  font-light rounded-l-none rounded-r-sm data-[state=on]:bg-primary data-[state=on]:text-white"
                onClick={() => toggleClick("cohorts")}
                value="cohorts"
              >
                <div className=" text-xs">Cohorts</div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        {notifDataCohort.isRefetching && <Refetching />}
        {notifDataCohort.isError && <Error />}
        {!notifDataCohort.isError && notifDataCohort.isLoading && <Loading />}
        {!notifDataCohort.isError &&
          !notifDataCohort.isLoading &&
          notifDataCohort.data &&
          recipientCohortCount == 1 &&
          notifDataCohort.data.constructor === Array && (
            <div>
              <NotificationTable
                columns={columns}
                data={[...notifDataCohort.data].reverse()}
              />
            </div>
          )}
        {notifDataPoc.isRefetching && <Refetching />}
        {notifDataPoc.isError && <Error />}
        {!notifDataPoc.isError && notifDataPoc.isLoading && <Loading />}
        {!notifDataPoc.isError &&
          !notifDataPoc.isLoading &&
          notifDataPoc.data &&
          recipientPartnerCount == 1 &&
          notifDataPoc.data.constructor === Array && (
            <div>
              <NotificationTable
                columns={columns}
                data={[...notifDataPoc.data].reverse()}
              />
            </div>
          )}
      </div>
    </div>
  );
}
