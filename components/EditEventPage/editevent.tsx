"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

const generateOptions = (count: number) =>
  Array.from({ length: count }, (_, i) => (i + 1).toString().padStart(2, "0"));

export default function EditEvent() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStartHour, setSelectedStartHour] = useState("");
  const [selectedMinute, setSelectedMinute] = useState("");
  const [selectedEndHour, setSelectedEndHour] = useState("");
  const [selectedEndMinute, setSelectedEndMinute] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isregistered, setIsRegistered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (
      !eventName ||
      !description ||
      !startDate ||
      !selectedStartHour ||
      !selectedMinute ||
      !endDate ||
      !selectedEndHour ||
      !selectedEndMinute
    ) {
      alert("Please fill in all fields.");
      return;
    }
    const startDateTime = new Date(
      `${startDate}T${selectedStartHour}:${selectedMinute}`
    );
    const now = new Date();
    if (startDateTime < now) {
      alert("You cannot book an event in the past.");
      return;
    }
    const endDateTime = new Date(
      `${endDate}T${selectedEndHour}:${selectedEndMinute}`
    );

    console.log("Event Name:", eventName);
    console.log("Description:", description);
    console.log("Start:", startDateTime.toString());
    console.log("End:", endDateTime.toString());
    console.log("Registration Open:", isChecked);
    console.log("Registration Required:", isregistered);
    console.log("Open to All:", isOpen);
  };

  const renderSelect = (
    value: string,
    setValue: (v: string) => void,
    options: string[]
  ) => (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full h-[54px] text-xl mt-8 border-2 border-slate-400 rounded-md px-4 py-2 relative">
        <span className="text-left w-full pr-6">{value || ""}</span>
        <ChevronDown className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3 sm:right-3 sm:left-auto left-3 sm:translate-x-0 -translate-x-1/2" />
      </SelectTrigger>
      <SelectContent className="w-full min-w-[9rem] max-w-full bg-slate-50 z-10 rounded-md shadow-md">
        <div className="max-h-52 overflow-y-auto">
          {options.map((val) => (
            <SelectItem
              key={val}
              value={val}
              className="w-full text-center text-xl px-4 py-2"
            >
              {val}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );

  const toggles = [
    {
      label: "Is Registration Open?",
      checked: isChecked,
      onChange: setIsChecked,
      margin: "md:ml-12 sm:ml-4 lg:ml-16",
    },
    {
      label: "Is Registration Required?",
      checked: isregistered,
      onChange: setIsRegistered,
      margin: "md:ml-4 sm:ml-4 lg:ml-8",
    },
    {
      label: "Is it Open to All?",
      checked: isOpen,
      onChange: setIsOpen,
      margin: "md:ml-[92px] sm:ml-4 lg:ml-[108px]",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-400 p-4">
      <div className="bg-slate-100 w-full max-w-[70rem] rounded-lg p-4 sm:p-8">
        <div className="text-blue-800 text-3xl sm:text-5xl mb-8 sm:mb-10">
          Create Event
        </div>

        <div className="mb-6">
          <h1 className="text-lg text-black font-bold mb-2">Event Name</h1>
          <Input
            type="text"
            placeholder="SAMAHAN SYSDEV GENERAL ASSEMBLY"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full h-[46px] border-slate-400 border-[2px] rounded-[6px]"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-lg text-black font-bold mb-2">Description</h1>
          <Input
            type="text"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[46px] border-slate-400 border-[2px] rounded-[6px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <div>
            <h1 className="text-lg text-black font-bold mb-1 w-44">
              Start Date and Time
            </h1>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-[54px] text-center text-md border border-slate-400 rounded-md px-2"
            />
          </div>
          <div className="col-span-1">
            {renderSelect(
              selectedStartHour,
              setSelectedStartHour,
              generateOptions(12)
            )}
          </div>
          <div className="col-span-1">
            {renderSelect(
              selectedMinute,
              setSelectedMinute,
              generateOptions(59)
            )}
          </div>
          <div>
            <h1 className="text-lg text-black font-bold mb-1">
              End Date and Time
            </h1>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-[54px] text-center text-md border border-slate-400 rounded-md px-2"
            />
          </div>
          <div className="col-span-1">
            {renderSelect(
              selectedEndHour,
              setSelectedEndHour,
              generateOptions(12)
            )}
          </div>
          <div className="col-span-1">
            {renderSelect(
              selectedEndMinute,
              setSelectedEndMinute,
              generateOptions(59)
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-10">
          {toggles.map(({ label, checked, onChange, margin }, index) => (
            <div
              key={index}
              className={`flex flex-col sm:flex-row md:items-center sm:gap-4 lg:flex-row lg:items-center`}
            >
              <h1 className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl font-medium">
                {label}
              </h1>
              <Switch
                checked={checked}
                onCheckedChange={onChange}
                className={`h-10 w-24 border-2 mt-2 ${margin} data-[state=unchecked]:bg-[#94A3B8] data-[state=checked]:bg-blue-500 py-5 px-2 [&>span]:h-8 [&>span]:w-8 data-[state=checked]:[&>span]:translate-x-[44px]`}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Dialog>
            <DialogTrigger asChild className="w-full sm:w-auto">
              <Button
                variant="default"
                className="bg-[#EF4444] w-full sm:w-[6rem]"
              >
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogDescription className="text-center text-black">
                  Are you sure you want to cancel the <br /> creation of this
                  organization?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-4 mr-[55px]">
                <DialogClose asChild>
                  <Button type="button" className="bg-[#EF4444] w-[7rem]">
                    No
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" className="bg-[#1D4ED8] w-[7rem]">
                    Yes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            onClick={handleSubmit}
            className="bg-[#1D4ED8] text-white w-full sm:w-[6rem] rounded-lg"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
