import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { useSession } from "next-auth/react";

export function AddPartner() {
  const [open, setOpen] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Partner</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Partner</DialogTitle>
          </DialogHeader>
          <PartnerAddForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Partner</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Partner</DrawerTitle>
        </DrawerHeader>
        <PartnerAddForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function PartnerAddForm({ className }: React.ComponentProps<"form">) {
  const [orgName, setOrgName] = React.useState("");
  const [orgEmail, setOrgEmail] = React.useState("");
  const session = useSession();
  const [send, setSend] = React.useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (orgEmail && orgName) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/pocinvite`,
          {
            name: orgName,
            email: orgEmail,
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
              destination: orgEmail,
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
    <div>
      {send && (
        <div className=" flex flex-col items-center gap-3">
          <SentIcon className=" text-primary" />
          <div>Partner invite has been send successfully.</div>
        </div>
      )}
      {!send && (
        <div>
          <form
            onSubmit={onSubmit}
            className={cn("grid items-start gap-4", className)}
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                type="text"
                id="name"
                onChange={(e) => {
                  setOrgName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Email</Label>
              <Input
                type="email"
                id="email"
                onChange={(e) => {
                  setOrgEmail(e.target.value);
                }}
              />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </div>
      )}
    </div>
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
