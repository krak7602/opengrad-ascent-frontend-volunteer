"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetch } from "@/lib/useFetch";
import { useListState } from "@mantine/hooks";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Feedback({
  feedbackId,
  title,
}: {
  feedbackId: string;
  title: string;
}) {
  const router = useRouter();
  const session = useSession();

  const { data, loading, error, refetch, abort } = useFetch<Feedback>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/get/${feedbackId}`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
  interface FeedbackItem {
    id: number;
    type: string;
    question: string;
    option_count: number;
    options: string[];
  }
  interface Feedback {
    id: number;
    recipientType: string;
    recipientId: number[];
    feedbackIitemCount: number;
    feedbackItems: FeedbackItem[];
  }

  interface responseItem {
    feedbackitem_id: number;
    item_type: string;
    option_ans: string;
    descr_ans: string;
    question: string;
  }

  interface response {
    form_id: number;
    vol_id: number;
    feedbackitemResponses: responseItem[];
  }

  const [respItems, setRespItems] = useListState<responseItem>();

  let resps: responseItem[] = [];
  useEffect(() => {
    if (data) {
      data.feedbackItems.forEach((element) => {
        setRespItems.append({
          feedbackitem_id: element.id,
          item_type: element.type,
          option_ans: "",
          descr_ans: "",
          question: element.question,
        });
      });
    }
  }, [data, setRespItems]);

  const handleDescChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
  ) => {
    setRespItems.setItem(index, {
      feedbackitem_id: respItems[index].feedbackitem_id,
      item_type: respItems[index].item_type,
      option_ans: respItems[index].option_ans,
      descr_ans: e.target.value,
      question: respItems[index].question,
    });
  };

  const handleOptChange = (ans: string, index: number) => {
    setRespItems.setItem(index, {
      feedbackitem_id: respItems[index].feedbackitem_id,
      item_type: respItems[index].item_type,
      option_ans: ans,
      descr_ans: respItems[index].descr_ans,
      question: respItems[index].question,
    });
  };

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (data) {
        const resp = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/response`,
          {
            form_id: data?.id,
            vol_id: session.data?.user.auth_id,
            feedbackitemResponses: respItems,
          },
          {
            headers: {
              authorization: `Bearer ${session.data?.user.auth_token}`,
            },
          },
        );
      }
    } catch (e) {
      console.log(e);
    }
    router.push("/inbox");
  };

  return (
    <div>
      <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start justify-between pb-4">
          <div className=" underline decoration-4 decoration-primary text-2xl font-bold">
            {title}
          </div>
        </div>
        <div className="overflow-x-auto px-1 pt-2">
          <form onSubmit={formSubmit}>
            <div className=" flex flex-col gap-4">
              {data?.feedbackItems.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col p-2 bg-gray-100 rounded ring-1 ring-gray-200"
                  >
                    <div className=" font-medium text-md text-pretty py-2 text-sm">
                      {index + 1}. {value.question}
                    </div>
                    {value.type === "descriptive" && (
                      <div>
                        <Textarea
                          className="min-h-[100px] min-w-max text-sm"
                          onChange={(e) => {
                            handleDescChange(e, index);
                          }}
                        />
                      </div>
                    )}
                    {value.type === "multiplechoice" && (
                      <div>
                        <RadioGroup
                          onValueChange={(e) => {
                            handleOptChange(e, index);
                          }}
                        >
                          {value.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={opt} id={opt} />
                              <Label className=" font-normal" htmlFor={opt}>
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                );
              })}
              <Button type="submit" className=" w-full lg:w-fit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
