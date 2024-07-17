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
import axios from "axios";
import { useSession } from "next-auth/react";
import { useFetch } from "@mantine/hooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AddVolunteerCohort({ cohId }: { cohId: string }) {
  const [open, setOpen] = React.useState(false);
  const [studName, setStudName] = React.useState("");
  const [studEmail, setStudEmail] = React.useState("");
  const [studPhone, setStudPhone] = React.useState("");
  const [volSelected, setVolSelected] = React.useState<vol>();
  const session = useSession();
  const [send, setSend] = React.useState(false);
  interface vol {
    id: number;
  }

  interface vols {
    id: number;
    name: string;
    startDate: number;
    endDate: number;
    vol: vol[];
  }
  const { data, loading, error, refetch, abort } = useFetch<vols[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/volByCohort/${cohId})}`,
    {
      headers: {
        authorization: `bearer ${session.data?.user.auth_token}`,
      },
    },
  );
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (studEmail && studName && studPhone) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/create`,
          {
            name: studName,
            email: studEmail,
            phone: studPhone,
            volId: 2,
            cohortId: Number(cohId),
          },
          {
            headers: {
              Authorization: `bearer ${session.data?.user.auth_token}`,
            },
          },
        );

        if (resp.data.success) {
          setSend(true);
        }
      }
    } catch (e) {
      console.log(e);
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
          <DrawerTitle>Add Volunteer</DrawerTitle>
        </DrawerHeader>
        <div className=" px-4">
          <form onSubmit={onSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                onChange={(e) => {
                  setStudName(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                onChange={(e) => {
                  setStudEmail(e.target.value);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Email</Label>
              <Input
                type="number"
                id="phone"
                maxLength={10}
                onChange={(e) => {
                  setStudPhone(e.target.value);
                }}
              />
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Label htmlFor="enddate">Members</Label>
                </AccordionTrigger>
                <AccordionContent>
                  <Command>
                    <CommandInput placeholder="Select Volunteer" />
                    <CommandList>
                      <CommandEmpty>No recipient found.</CommandEmpty>
                      <CommandGroup className=" overflow-y-auto h-32 lg:h-56">
                        {data && data.constructor === Array && (
                          <div>
                            {data[0].vol.map((value) => (
                              <CommandItem
                                key={value.id}
                                value={value.id.toString()}
                                onSelect={(currentValue) => {
                                  setVolSelected(value);
                                }}
                              >
                                {value.id}
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
            <Button type="submit">Add</Button>
          </form>
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
