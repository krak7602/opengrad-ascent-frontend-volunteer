import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Question({
  handleDescChange,
  handleOptionsChange,
  handleAddOption,
  RemoveQuestion,
  type,
  index,
  optionCount,
}: {
  handleDescChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
  ) => void;
  handleOptionsChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    qnIndex: number,
    optIndex: number,
  ) => void;
  handleAddOption: (index: number) => void;
  RemoveQuestion: (id: number) => void;
  type: string;
  index: number;
  optionCount: number;
}) {
  return (
    <div className="rounded-sm bg-gray-100 border p-2">
      <div className=" flex flex-col">
        <div>This is there</div>
        <div className="flex flex-row justify-between items-center pb-1">
          <div className=" font-light text-xs px-1">{index + 1}</div>
          {type === "desc" && (
            <div className=" font-light text-xs">Descriptive</div>
          )}
          {type === "mcq" && (
            <div className=" font-light text-xs">Multiple Choice</div>
          )}
          <CancelIconLight
            className="font-light text-xs h-3"
            onClick={() => RemoveQuestion(index)}
          />
        </div>

        <Textarea
          className="min-h-[100px] min-w-max"
          onChange={(e) => {
            handleDescChange(e, index);
          }}
        />
        {type === "mcq" && optionCount >= 1 && (
          <div>
            <div>A</div>
            <Textarea
              className="min-h-1 min-w-max"
              placeholder="Option description"
              onChange={(e) => {
                handleOptionsChange(e, index, 0);
              }}
            />
          </div>
        )}
        {type === "mcq" && optionCount >= 2 && (
          <div>
            <div>B</div>
            <Textarea
              className="min-h-1 min-w-max"
              placeholder="Option description"
              onChange={(e) => {
                handleOptionsChange(e, index, 1);
              }}
            />
          </div>
        )}
        {type === "mcq" && optionCount >= 3 && (
          <div>
            <div>C</div>
            <Textarea
              className="min-h-1 min-w-max"
              placeholder="Option description"
              onChange={(e) => {
                handleOptionsChange(e, index, 2);
              }}
            />
          </div>
        )}
        {type === "mcq" && optionCount >= 4 && (
          <div>
            <div>D</div>
            <Textarea
              className="min-h-1 min-w-max"
              placeholder="Option description"
              onChange={(e) => {
                handleOptionsChange(e, index, 3);
              }}
            />
          </div>
        )}
        {type === "mcq" && (
          <Button
            onClick={() => handleAddOption(index)}
            type="button"
            className=" mt-2 flex items-center justify-center gap-2"
            variant="outline"
          >
            <PlusIcon className="h-4 w-4 text-black" />
            Add Option
          </Button>
        )}
      </div>
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
