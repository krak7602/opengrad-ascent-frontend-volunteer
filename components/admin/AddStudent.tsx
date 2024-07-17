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
interface user_id {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface vol {
  id: number;
  user_id: user_id;
}

interface vols {
  id: number;
  name: string;
  startDate: number;
  endDate: number;
  vol: vol[];
}

export function AddStudent({ cohId, data }: { cohId: string; data: vols[] }) {
  const [open, setOpen] = React.useState(false);
  const [studName, setStudName] = React.useState("");
  const [studEmail, setStudEmail] = React.useState("");
  const [studPhone, setStudPhone] = React.useState("");
  const [volSelected, setVolSelected] = React.useState<vol>();
  const session = useSession();
  const [send, setSend] = React.useState(false);

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface vol {
    id: number;
    user_id: user_id;
  }

  interface vols {
    id: number;
    name: string;
    startDate: number;
    endDate: number;
    vol: vol[];
  }

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
            volId: volSelected?.id,
            cohortId: Number(cohId),
          },
          {
            headers: {
              Authorization: `Bearer ${session.data?.user.auth_token}`,
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Student</DrawerTitle>
        </DrawerHeader>
        <div>
          {send && (
            <div className=" flex flex-col items-center gap-3">
              <CheckmarkCircleIcon className=" text-primary" />
              <div>Student has been added to cohort.</div>
            </div>
          )}
        </div>
        {!send && (
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="tel"
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
                    <Label htmlFor="enddate">Volunteer</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Command>
                      <CommandInput
                        placeholder="Select Volunteer"
                        value={volSelected?.user_id.name}
                      />
                      <CommandList>
                        <CommandEmpty>No recipient found.</CommandEmpty>
                        <CommandGroup className=" overflow-y-auto h-32 lg:h-56">
                          {data && data.constructor === Array && (
                            <div>
                              {data[0].vol.map((value) => (
                                <CommandItem
                                  key={value.id}
                                  value={value.user_id.name}
                                  onSelect={(currentValue) => {
                                    setVolSelected(value);
                                  }}
                                >
                                  {value.user_id.name}
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
        )}
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
