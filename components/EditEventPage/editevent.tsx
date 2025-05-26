"use client";
import * as React from "react";
import { useState } from "react";
import { EditEventSchema, EditEventFormData } from "@/client/schemas/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const generateOptions = (count: number) =>
  Array.from({ length: count }, (_, i) => (i + 1).toString().padStart(2, "0"));

export default function EditEvent() {
  const form = useForm<EditEventFormData>({
    resolver: zodResolver(EditEventSchema),
    defaultValues: {
      eventName: "",
      description: "",
      startDate: "",
      selectedStartHour: "",
      selectedMinute: "",
      endDate: "",
      selectedEndHour: "",
      selectedEndMinute: "",
      isChecked: false,
      isregistered: false,
      isOpen: false,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = form;

  const [isChecked, setIsChecked] = useState(false);
  const [isregistered, setIsRegistered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    reset();
    setIsChecked(false);
    setIsRegistered(false);
    setIsOpen(false);
  };

  const onSubmit = (data: EditEventFormData) => {
    const startDateTime = new Date(
      `${data.startDate}T${data.selectedStartHour}:${data.selectedMinute}`
    );
    const now = new Date();
    if (startDateTime < now) {
      alert("You cannot book an event in the past.");
      return;
    }
  };

  const renderSelect = (
    name: keyof EditEventFormData,
    value: string,
    options: string[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <Select
            value={value}
            onValueChange={(val) =>
              setValue(name, val, { shouldValidate: true })
            }
          >
            <FormControl>
              <SelectTrigger className="w-full h-[54px] text-xl mt-8 border-2 border-slate-400 rounded-md px-4 py-2 relative">
                <span className="text-center w-full">{value || ""}</span>
                <ChevronDown className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-3" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="w-full bg-slate-50 rounded-md shadow-md">
              <div className="max-h-52 overflow-y-auto">
                {options.map((val) => (
                  <SelectItem
                    key={val}
                    value={val}
                    className="w-full text-xl px-4 py-2 flex justify-center"
                  >
                    {val}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
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

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <Label className="font-bold">Event Name</Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="SAMAHAN SYSDEV GENERAL ASSEMBLY"
                      {...field}
                      className="w-full h-[46px] border-slate-400 border-[2px] rounded-[6px] text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <Label className="font-bold">Description</Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter a description"
                      {...field}
                      className="w-full h-[46px] border-slate-400 border-[2px] rounded-[6px] text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold">Start Date and Time</Label>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="w-full h-[54px] text-center text-md border-2 border-slate-400 rounded-md px-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {renderSelect(
                "selectedStartHour",
                watch("selectedStartHour"),
                generateOptions(12)
              )}
              {renderSelect(
                "selectedMinute",
                watch("selectedMinute"),
                generateOptions(59)
              )}

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <Label className="font-bold">End Date and Time</Label>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="w-full h-[54px] text-center text-md border-2 border-slate-400 rounded-md px-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {renderSelect(
                "selectedEndHour",
                watch("selectedEndHour"),
                generateOptions(12)
              )}
              {renderSelect(
                "selectedEndMinute",
                watch("selectedEndMinute"),
                generateOptions(59)
              )}
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
                    onCheckedChange={(val) => {
                      onChange(val);
                      setValue(
                        label === "Is Registration Open?"
                          ? "isChecked"
                          : label === "Is Registration Required?"
                          ? "isregistered"
                          : "isOpen",
                        val
                      );
                    }}
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
                    className="bg-red-500 w-full sm:w-[6rem]"
                  >
                    Cancel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogDescription className="text-center text-black text-base sm:text-lg md:text-xl">
                      Are you sure you want to cancel the creation of this
                      event?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-4 sm:justify-center mt-6 sm:mt-8">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="bg-[#EF4444] w-full sm:w-[7rem] text-base sm:text-lg"
                      >
                        No
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        onClick={handleClear}
                        className="bg-[#1D4ED8] w-full sm:w-[7rem] text-base sm:text-lg"
                      >
                        Yes
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                type="submit"
                className="bg-[#1D4ED8] text-white w-full sm:w-[6rem] rounded-lg"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
