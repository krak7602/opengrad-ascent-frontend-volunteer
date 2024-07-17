import { AddPartner } from "@/components/admin/AddPartner";
import { PartnerTable } from "@/components/admin/PartnerTable";
import { columns } from "@/components/admin/PartnerColumn";
import { useSession } from "next-auth/react";
import { useFetch } from "@/lib/useFetch";

export default function PartnerListing() {
  interface poc {
    id: number;
    user_id: user_id;
  }

  interface user_id {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  const session = useSession();
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

  return (
    <div className="container mx-auto my-6 px-2 lg:px-8">
      <div className="flex flex-col lg:flex-row items-start justify-between mb-2 py-4 rounded bg-primary text-white px-4">
        <h1 className="text-2xl pb-1 font-bold">Partners</h1>
        <div className="flex w-full flex-row justify-end">
          <div className=" text-black">
            <AddPartner />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        {data && data.constructor === Array && (
          <div>
            <PartnerTable columns={columns} data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
