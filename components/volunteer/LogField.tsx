import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface slotItem {
  id: number;
  hourStart: string;
  minStart: string;
  hourEnd: string;
  minEnd: string;
  activity: string;
  details: string;
}

export default function LogField({
  handleSlotFieldChange,
  handleTimeChange,
  index,
}: {
  handleSlotFieldChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    field: string,
  ) => void;
  handleTimeChange: (
    value: string,
    index: number,
    field: string,
    pos: string,
  ) => void;
  index: number;
}) {
  return (
    <div>
      <div className="pb-2 pt-1">
        <Label htmlFor="slot-start" className="pb-1">
          Slot Start
        </Label>
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>

            <Select
              onValueChange={(value) => {
                handleTimeChange(value, index, "hour", "start");
              }}
            >
              <SelectTrigger className="w-[62px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-nonew-[25px]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="01">01</SelectItem>
                <SelectItem value="02">02</SelectItem>
                <SelectItem value="03">03</SelectItem>
                <SelectItem value="04">04</SelectItem>
                <SelectItem value="05">05</SelectItem>
                <SelectItem value="06">06</SelectItem>
                <SelectItem value="07">07</SelectItem>
                <SelectItem value="08">08</SelectItem>
                <SelectItem value="09">09</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="13">13</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="17">17</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="19">19</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="21">21</SelectItem>
                <SelectItem value="22">22</SelectItem>
                <SelectItem value="23">23</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1 text-center">
            <Label htmlFor="mins" className="text-xs">
              Mins
            </Label>
            <Select
              onValueChange={(value) => {
                handleTimeChange(value, index, "min", "start");
              }}
            >
              <SelectTrigger className="w-[62px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-nonew-[25px]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <Label htmlFor="slot-end" className="pb-1">
          Slot End
        </Label>
        <div className="flex items-end gap-2">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Hours
            </Label>

            <Select
              onValueChange={(value) => {
                handleTimeChange(value, index, "hour", "end");
              }}
            >
              <SelectTrigger className="w-[62px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-nonew-[25px]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="01">01</SelectItem>
                <SelectItem value="02">02</SelectItem>
                <SelectItem value="03">03</SelectItem>
                <SelectItem value="04">04</SelectItem>
                <SelectItem value="05">05</SelectItem>
                <SelectItem value="06">06</SelectItem>
                <SelectItem value="07">07</SelectItem>
                <SelectItem value="08">08</SelectItem>
                <SelectItem value="09">09</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="13">13</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="17">17</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="19">19</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="21">21</SelectItem>
                <SelectItem value="22">22</SelectItem>
                <SelectItem value="23">23</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1 text-center">
            <Label htmlFor="mins" className="text-xs">
              Mins
            </Label>
            <Select
              onValueChange={(value) => {
                handleTimeChange(value, index, "min", "end");
              }}
            >
              <SelectTrigger className="w-[62px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-nonew-[25px]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="00">00</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="col-span-2 py-3">
        <Label htmlFor="activity">Activity</Label>
        <Textarea
          className="min-h-[100px] min-w-max"
          onChange={(e) => {
            handleSlotFieldChange(e, index, "details");
          }}
          placeholder="Describe your activity"
        />
      </div>
    </div>
  );
}
