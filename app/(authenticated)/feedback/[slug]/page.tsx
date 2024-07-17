"use client";
import Feedback from "@/components/volunteer/Feedback";

export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string };
}) {
  const title = searchParams["title"];
  return (
    <div>
      <Feedback feedbackId={params.slug} title={title} />
    </div>
  );
}
