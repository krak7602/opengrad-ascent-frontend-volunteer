"use client";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import axios from "axios";
import { useListState } from "@mantine/hooks";
import { StudentTable } from "@/components/volunteer/StudentTable";
import { columns } from "@/components/volunteer/StudentColumn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import Refetching from "@/components/Refetching";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = useSession();
  const [students, setStudents] = useListState<student>();
  const [selectedCohort, setSelectedCohort] = useState<Cohorts>();
  const queryClient = useQueryClient();

  interface student {
    id: number;
    name: string;
    email: string;
    phone: string;
    volId: number;
    cohortId: number;
  }

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

  interface PocForDetails {
    id: number;
    user_id: user_id;
  }

  interface studentInfo {
    Poc: Poc;
    Cohorts: Cohorts[];
  }

  const { data, isError, isLoading, isRefetching } = useQuery<studentInfo>({
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

  // const { data, loading, error, refetch, abort } = useFetch<studentInfo>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/volfuldata`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session],
  // );
  //
  const PocDetails = useQuery<PocForDetails>({
    queryKey: ["pocData"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocById/${data?.Poc?.poc?.id}`,
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

  // const PocDetails = useFetch<PocForDetails>(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocById/${data?.Poc?.poc?.id}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${session.data?.user.auth_token}`,
  //     },
  //     autoInvoke: true,
  //   },
  //   [session, data],
  // );

  const mutation = useMutation({
    mutationKey: ["getStudents"],
    mutationFn: async (data: any) => {
      try {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/getAll`,
          {
            volId: session.data?.user.auth_id,
            cohortId: data,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
        setStudents.setState(resp.data);
      } catch (e) {
        console.log(e);
      }
    },
    onSettled: (data: any) => {
      // setStudents.setState(resp.data);
      // queryClient.invalidateQueries({ queryKey: ["dailyLog"] });
    },
  });

  const getStudents = async (cohId: number) => {
    try {
      mutation.mutate(cohId);
    } catch (e) {
      console.log(e);
    }
    // const resp = await axios.post(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/getAll`,
    //   {
    //     volId: session.data?.user.auth_id,
    //     cohortId: cohId,
    //   },
    //   {
    //     headers: {
    //       authorization: `Bearer ${session.data?.user.auth_token}`,
    //     },
    //   },
    // );
    // setStudents.setState(resp.data);
  };

  const setCohort = (val: string) => {
    data?.Cohorts?.forEach((value) => {
      if (value.name === val) {
        getStudents(value.id);
        setSelectedCohort(value);
      }
    });
  };

  return (
    <div>
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 items-start justify-between mb-2 pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="rounded-sm text-xs bg-primary text-white p-1 font-bold pl-1 md:mr-5 w-fit">
              {PocDetails?.data?.user_id?.name}
            </h1>
            <h1 className="text-2xl pb-1 font-bold">Assigned Mentees </h1>
          </div>
          <Select onValueChange={(val) => setCohort(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cohort" />
            </SelectTrigger>
            <SelectContent>
              {data?.Cohorts && data.Cohorts.constructor === Array && (
                <div>
                  {data.Cohorts.map((cohort, index) => {
                    return (
                      <div key={index}>
                        <SelectItem value={cohort.name}>
                          {cohort.name}
                        </SelectItem>
                      </div>
                    );
                  })}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          {isRefetching && <Refetching />}
          {isError && <Error />}
          {!isError && isLoading && <Loading />}
          {!isError && !isLoading && students && (
            // { students && (
            <div>
              <StudentTable columns={columns} data={students} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: { className: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
