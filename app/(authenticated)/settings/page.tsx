"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Input } from "@/components/ui/input";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface details {
    id: number;
    user_id: user_id;
  }
  const session = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { data, loading, error, refetch, abort } = useFetch<details>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/getfulldata`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
  async function submitChangeName() {
    try {
      if (name) {
        const resp = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/editName`,
          {
            name: name,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
        if (resp.data.name) toast({ title: "Profile name has been changed!" });
      }
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="container mx-auto my-6 px-2 lg:px-8">
      <div className="flex flex-col gap-4">
        <div className=" pb-1">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">Information</div>
          {data && data.user_id && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex flex-row items-center gap-2 h-6">
                    <div>{data.user_id.name}</div>
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger className="text-sm text-gray-500 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                        <PencilEditIcon className="text-inherit" />
                      </DrawerTrigger>
                      <DrawerContent className="pb-6">
                        <DrawerHeader className="text-left">
                          <DrawerTitle className="text-2xl font-bold px-1">
                            Change Name
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4">
                          <form className="flex flex-col gap-4">
                            <Input
                              type="text"
                              placeholder=""
                              onChange={(e) => {
                                setName(e.target.value);
                              }}
                            />
                            <Button type="button" onClick={submitChangeName}>
                              Confirm Change
                            </Button>
                          </form>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-xl">Sign out</div>
          <Button
            onClick={() => signOut()}
            className="bg-red-500 w-fit hover:bg-red-600"
          >
            Sign out of this device
          </Button>
        </div>
      </div>
    </div>
  );
}

const PencilEditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 20H17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
