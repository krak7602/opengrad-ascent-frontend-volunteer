import SignIn from "@/components/volunteer/SignIn";
import Image from "next/image";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const role = "volunteer";
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-700">
            <OpengradIcon className="h-6 w-6" />
          </div>
        </div>
        <SignIn curRole={role} />
      </div>
    </div>
  );
}

function OpengradIcon(props: { className: string }) {
  return (
    <Image
      className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
      src="/opengrad.svg"
      alt="Opengrad logo"
      width={160}
      height={60}
      priority
    />
  );
}
