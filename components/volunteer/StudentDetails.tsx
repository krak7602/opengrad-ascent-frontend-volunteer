import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface studentData {
  id: number;
  name: string;
  email: string;
  phone: string;
  volId: number;
  cohortId: number;
}

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

export function StudentDetails({ studId }: { studId: string }) {
  const session = useSession();
  const { data, loading, error, refetch, abort } = useFetch<studentData>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/${studId}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Details</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {loading && (
            <div>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          )}
          {data && (
            <div>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{data.name}</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="email">Email</Label>
                    <div className="col-span-2 h-6">{data.email}</div>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="email">Phone</Label>
                    <div className="col-span-2 h-6">{data.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
