import * as React from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
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

interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface poc {
  id: number;
}

interface vol {
  id: number;
  poc: poc;
  user_id: user_id;
}
export function AssignVolunteer({ cohId }: { cohId: number }) {
  const session = useSession();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedVolunteer, setSelectedVolunteer] = useState<vol>();
  const [send, setSend] = useState(false);

  const { data, loading, error, refetch, abort } = useFetch<vol[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/volbyPoc/${session.data?.user.auth_id}`,
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
    try {
      if (selectedVolunteer) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/assignvol`,
          {
            cohortId: cohId,
            volRelationId: selectedVolunteer.id,
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

  const setVolunteer = (selectedVol: string) => {
    if (data) {
      data.forEach((element) => {
        if (element.user_id.name === selectedVol) {
          setSelectedVolunteer(element);
        }
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Assign Volunteer</DrawerTitle>
        </DrawerHeader>
        <div>
          {send && (
            <div className=" flex flex-col items-center gap-3">
              <CheckmarkCircleIcon className=" text-primary" />
              <div>Volunteer has been assigned to cohort.</div>
            </div>
          )}
          {!send && (
            <div className=" px-4">
              <form onSubmit={onSubmit} className="grid items-start gap-4">
                <Command>
                  <CommandInput
                    placeholder="Select Volunteer"
                    value={selectedVolunteer?.user_id.name}
                  />
                  <CommandList>
                    <CommandEmpty>No recipient found.</CommandEmpty>
                    <CommandGroup className=" overflow-y-auto h-32 lg:h-56">
                      {data && data.constructor === Array && (
                        <div>
                          {data.map((volu) => (
                            <CommandItem
                              key={volu.id}
                              value={volu.user_id.name}
                              onSelect={(currentValue) => {
                                setVolunteer(currentValue);
                              }}
                            >
                              {volu.user_id.name}
                            </CommandItem>
                          ))}
                        </div>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
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
