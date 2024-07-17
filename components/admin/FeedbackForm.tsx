"use client";
import React, { useState } from "react";
import { useListState } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import { PopoverClose } from "@radix-ui/react-popover";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useFetch } from "@/lib/useFetch";
import { useSession } from "next-auth/react";

export default function FeedbackForm() {
  interface FeedbackItem {
    type: string;
    question: string;
    option_count: number;
    options: string[];
  }

  const session = useSession();
  interface cohortColumn {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  }
  const cohortData = useFetch<cohortColumn[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohort/all`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );
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
  const partnerData = useFetch<poc[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/get/poc`,
    {
      headers: {
        authorization: `Bearer ${session.data?.user.auth_token}`,
      },
      autoInvoke: true,
    },
    [session],
  );

  const router = useRouter();
  const { toast } = useToast();
  const [questionCount, setQuestionCount] = useState(0);
  const [cohortAdd, setCohortAdd] = useState(false);
  const [partnerAdd, setPartnerAdd] = useState(true);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [recipientCohortCount, setRecipientCohortCount] = useState(0);
  const [recipientPartnerCount, setRecipientPartnerCount] = useState(0);
  const [recipientCohorts, setRecipientCohorts] = useListState<cohortColumn>(
    [],
  );
  const [recipientPartners, setRecipientPartners] = useListState<poc>([]);
  const [questions, setQuestions] = useListState<FeedbackItem>([]);

  interface cohort {
    id: number;
    name: string;
  }

  interface partner {
    id: number;
    name: string;
  }

  const toggleClick = (option: string) => {
    if (option === "cohorts") {
      setCohortAdd(!cohortAdd);
      setPartnerAdd(false);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartners.setState([]);
      setRecipientPartnerCount(0);
    } else if (option === "partners") {
      setCohortAdd(false);
      setPartnerAdd(!partnerAdd);
      setRecipientCohorts.setState([]);
      setRecipientCohortCount(0);
      setRecipientPartners.setState([]);
      setRecipientPartnerCount(0);
    }
  };

  const AddPartner = (selectedPartner: poc) => {
    let found = false;
    recipientPartners?.forEach((element) => {
      if (element.user_id.name === selectedPartner.user_id.name) found = true;
    });
    if (!found && partnerData.data) {
      partnerData.data.forEach((element) => {
        if (element.user_id.name === selectedPartner.user_id.name) {
          setRecipientPartners.append(element);
          setRecipientPartnerCount(recipientPartnerCount + 1);
        }
      });
    }
  };

  const AddCohort = (selectedCohort: cohortColumn) => {
    let found = false;
    recipientCohorts?.forEach((element) => {
      if (element.name === selectedCohort.name) found = true;
    });
    if (!found && cohortData.data) {
      cohortData.data.forEach((element) => {
        if (element.name === selectedCohort.name) {
          setRecipientCohorts.append(element);
          setRecipientCohortCount(recipientCohortCount + 1);
        }
      });
    }
  };

  const RemovePartner = (id: number) => {
    setRecipientPartners.remove(id);
    setRecipientPartnerCount(recipientPartnerCount - 1);
  };

  const RemoveCohort = (id: number) => {
    setRecipientCohorts.remove(id);
    setRecipientCohortCount(recipientCohortCount - 1);
  };

  const handleIncreaseQuestions = (type: string) => {
    setQuestions.append({
      type: type,
      question: "",
      option_count: 0,
      options: [],
    });
    setQuestionCount(questionCount + 1);
  };

  const RemoveQuestion = (id: number) => {
    setQuestions.remove(id);
    setQuestionCount(questionCount - 1);
  };

  const addOption = (questionId: number) => {
    if (questions[questionId].option_count < 4) {
      const opt: string[] = questions[questionId].options;
      opt.push("");
      setQuestions.setItem(questionId, {
        type: questions[questionId].type,
        question: questions[questionId].question,
        option_count: questions[questionId].option_count + 1,
        options: opt,
      });
    }
  };

  const removeOption = (questionId: number, optId: number) => {
    const opt: string[] = questions[questionId].options;
    opt.splice(optId, 1);
    setQuestions.setItem(questionId, {
      type: questions[questionId].type,
      question: questions[questionId].question,
      option_count: questions[questionId].option_count - 1,
      options: opt,
    });
  };

  const handleDescChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
  ) => {
    setQuestions.setItem(index, {
      type: questions[index].type,
      question: e.target.value,
      option_count: questions[index].option_count,
      options: questions[index].options,
    });
  };

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    qnIndex: number,
    optIndex: number,
  ) => {
    const opt: string[] = questions[qnIndex].options;
    opt[optIndex] = e.target.value;
    setQuestions.setItem(qnIndex, {
      type: questions[qnIndex].type,
      question: questions[qnIndex].question,
      option_count: questions[qnIndex].option_count,
      options: opt,
    });
  };

  const formSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (recipientPartnerCount != 0) {
      try {
        if (questionCount != 0) {
          const parts = recipientPartners.map((x) => x.id);
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/create`,
            {
              receipientType: "poc",
              receipientId: parts,
              feedbackItemCount: questionCount,
              feedbackItems: questions,
            },
            {
              headers: {
                authorization: `Bearer ${session.data?.user.auth_token}`,
              },
            },
          );
          if (resp.data.id) {
            const resp2 = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/poc/create`,
              {
                typeofnotification: "form",
                Message: feedbackTitle,
                form_id: resp.data.id,
                receipient_id: parts,
              },
              {
                headers: {
                  authorization: `Bearer ${session.data?.user.auth_token}`,
                },
              },
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else if (recipientCohortCount != 0) {
      try {
        if (questionCount != 0) {
          const cohs = recipientCohorts.map((x) => x.id);
          const resp = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/forms/create`,
            {
              receipientType: "cohort",
              receipientId: cohs,
              feedbackItemCount: questionCount,
              feedbackItems: questions,
            },
            {
              headers: {
                authorization: `Bearer ${session.data?.user.auth_token}`,
              },
            },
          );
          if (resp.data.id) {
            const resp2 = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/notification/cohort/create`,
              {
                typeofnotification: "form",
                Message: feedbackTitle,
                form_id: resp.data.id,
                receipient_id: cohs,
              },
              {
                headers: {
                  authorization: `Bearer ${session.data?.user.auth_token}`,
                },
              },
            );
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    toast({
      title: "Feedback form sent",
    });
    setQuestionCount(0);
    setFeedbackTitle("");
    setOpen(false);
    setValue("");
    setRecipientCohortCount(0);
    setRecipientPartnerCount(0);
    setRecipientCohorts.setState([]);
    setRecipientPartners.setState([]);
    setQuestions.setState([]);
  };

  return (
    <div className="overflow-x-auto px-1 pt-2">
      <form onSubmit={formSubmit} className="flex flex-col gap-2">
        <Textarea
          onChange={(e) => setFeedbackTitle(e.target.value)}
          value={feedbackTitle}
          placeholder="Form Title"
          className=" text-wrap focus-visible:ring-transparent border-none underline-offset-2 underline decoration-primary decoration-4 font-bold text-2xl "
        />
        <div className="flex w-full flex-col items-start rounded-md border px-3 py-3">
          <div className="flex w-full flex-row px-1 py-1 items-center justify-between">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="lg:w-fit w-full font-light py-3 rounded-lg px-3  mb-2 flex justify-center items-center mr-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <div className="hidden md:block mx-2">Add Recipient</div>
                </Button>
              </PopoverTrigger>
              {partnerAdd && (
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Add Recipient" />
                    <CommandList>
                      <CommandEmpty>No recipient found.</CommandEmpty>
                      <CommandGroup>
                        {partnerData.data &&
                          partnerData.data.constructor === Array && (
                            <div>
                              {partnerData.data.map((partner) => (
                                <CommandItem
                                  key={partner.id}
                                  value={partner.user_id.name}
                                  onSelect={(currentValue) => {
                                    AddPartner(partner);
                                    setValue(
                                      currentValue === value
                                        ? ""
                                        : currentValue,
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {partner.user_id.name}
                                </CommandItem>
                              ))}
                            </div>
                          )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
              {cohortAdd && (
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Add Recipient" />
                    <CommandList>
                      <CommandEmpty>No recipient found.</CommandEmpty>
                      <CommandGroup>
                        {cohortData.data &&
                          cohortData.data.constructor === Array && (
                            <div>
                              {cohortData.data.map((cohort) => (
                                <CommandItem
                                  key={cohort.id}
                                  value={cohort.name}
                                  onSelect={(currentValue) => {
                                    AddCohort(cohort);
                                    setValue(
                                      currentValue === value
                                        ? ""
                                        : currentValue,
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  {cohort.name}
                                </CommandItem>
                              ))}
                            </div>
                          )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              )}
            </Popover>
            <ToggleGroup
              type="single"
              defaultValue="partners"
              className=" ml-1 gap-0 mb-2 rounded bg-slate-200"
            >
              <ToggleGroupItem
                className=" px-2 font-light rounded-l-sm rounded-r-none data-[state=on]:bg-primary data-[state=on]:text-white"
                onClick={() => toggleClick("partners")}
                value="partners"
              >
                <div className=" text-xs">Partners</div>
              </ToggleGroupItem>
              <ToggleGroupItem
                className=" px-2  font-light rounded-l-none rounded-r-sm data-[state=on]:bg-primary data-[state=on]:text-white"
                onClick={() => toggleClick("cohorts")}
                value="cohorts"
              >
                <div className=" text-xs">Cohorts</div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Separator />
          <div className=" px-1 pt-2">
            <div className="flex flex-wrap gap-2">
              {recipientCohorts?.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-500 text-white rounded-sm text-xs font-semibold px-1 flex flex-row items-center"
                >
                  <div>{value.name}</div>
                  <CancelIcon
                    onClick={() => RemoveCohort(index)}
                    className=" w-3 h-3 ml-1 text-white"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {recipientPartners?.map((value, index) => (
                <div
                  key={index}
                  className=" bg-gray-500 text-white rounded-sm text-xs font-semibold px-1 flex flex-row items-center"
                >
                  <div>{value.user_id.name}</div>
                  <CancelIcon
                    onClick={() => RemovePartner(index)}
                    className=" w-3 h-3 ml-1 text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {questions?.map((value, index) => (
          <div key={index}>
            <div className="rounded-sm bg-gray-100 border p-2">
              <div className=" flex flex-col">
                <div className="flex flex-row justify-between items-center pb-1">
                  <div className=" font-light text-xs px-1">{index + 1}</div>
                  {value.type === "descriptive" && (
                    <div className=" font-light text-xs">Descriptive</div>
                  )}
                  {value.type === "multiplechoice" && (
                    <div className=" font-light text-xs">Multiple Choice</div>
                  )}
                  <CancelIconLight
                    className="font-light text-xs h-3"
                    onClick={() => RemoveQuestion(index)}
                  />
                </div>

                <Textarea
                  className="min-h-[100px] min-w-max"
                  placeholder="Question"
                  onChange={(e) => {
                    handleDescChange(e, index);
                  }}
                />

                {value.type === "multiplechoice" && (
                  <div className="flex flex-col gap-2 pt-2">
                    {value.options.map((opt, idx) => (
                      <div key={idx} className=" flex flex-row gap-0">
                        <div className="rounded-l-md bg-green-600 text-white pr-1 flex flex-col justify-between items-center">
                          <div className="p-1 ">
                            {String.fromCharCode("A".charCodeAt(0) + idx)}
                          </div>
                          <CancelIcon
                            className="font-light text-green-200 text-xs h-9 py-3"
                            onClick={() => removeOption(index, idx)}
                          />
                        </div>
                        <Textarea
                          className="min-h-1 min-w-max rounded-l-none rounded-r-md border-green-600 border-2 m-0 focus-visible:ring-transparent"
                          placeholder="Option description"
                          onChange={(e) => {
                            handleOptionsChange(e, index, idx);
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      onClick={() => addOption(index)}
                      type="button"
                      className=" mt-2 flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <PlusIcon className="h-4 w-4 text-black" />
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col md:flex-row gap-2">
          <Popover>
            <PopoverTrigger
              type="button"
              className="px-4 py-1 flex items-center justify-center gap-2 border rounded-sm w-full lg:w-fit"
            >
              <PlusIcon className="h-4 w-4 text-black" />
              Add Question
            </PopoverTrigger>
            <PopoverContent className="w-80 flex flex-wrap">
              <PopoverClose
                onClick={() => {
                  handleIncreaseQuestions("descriptive");
                }}
                className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Descriptive
              </PopoverClose>
              <PopoverClose
                onClick={() => {
                  handleIncreaseQuestions("multiplechoice");
                }}
                className="m-1 grow h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Multiple Choice
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <div>
            <Button type="submit" className=" w-full lg:w-fit">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
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

const CancelIconLight = (props: React.SVGProps<SVGSVGElement>) => (
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
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
