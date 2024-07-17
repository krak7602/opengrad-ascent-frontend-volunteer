import * as React from "react";
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
import { useSession } from "next-auth/react";
import axios from "axios";

export function AddVolunteer({ id }: { id: number }) {
  const [open, setOpen] = React.useState(false);
  const [volName, setVolName] = React.useState("");
  const [volEmail, setVolEmail] = React.useState("");
  const [send, setSend] = React.useState(false);
  const session = useSession();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (volEmail && volName) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volinvite`,
          {
            name: volName,
            email: volEmail,
            Poc: id,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );

        if (resp.data.id) {
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profileset`,
            {
              destination: volEmail,
            },
            {
              headers: {
                authorization: `Bearer ${session.data?.user.auth_token}`,
              },
            },
          );
          if (resp.data.success) {
            setSend(true);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Volunteer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Volunteer</DrawerTitle>
        </DrawerHeader>
        <div>
          {send && (
            <div className=" flex flex-col items-center gap-3">
              <SentIcon className=" text-primary" />
              <div>Partner invite has been send successfully.</div>
            </div>
          )}
          {!send && (
            <div className=" px-2 w-full">
              <form onSubmit={onSubmit} className="px-4 flex flex-col gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    onChange={(e) => {
                      setVolName(e.target.value);
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    onChange={(e) => {
                      setVolEmail(e.target.value);
                    }}
                  />
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

const SentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={40}
    height={40}
    fill={"none"}
    {...props}
  >
    <path
      d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M11.5 12.5L15 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
