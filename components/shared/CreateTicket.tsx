"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TicketSchema } from "@/lib/zod/ticket.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DatePicker from "./registration-deadline";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

import { showCreateToast, showUpdateToast } from "@/components/shared/Toast";

interface CreateTicketProps {
  setModal: (value: boolean) => void;
  title: string;
  titleName: string;
  titleDesc: string;
  onCreate?: (data: any) => void;
  onUpdate?: (data: any) => void;
  setTickets: React.Dispatch<React.SetStateAction<any[]>>;
  initialData?: any;
  isUpdate?: boolean;
}

export default function CreateTicket({
  setModal,
  title,
  titleName,
  titleDesc,
  onCreate,
  onUpdate,
  setTickets,
  initialData,
  isUpdate = false,
}: CreateTicketProps) {
  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      ticket: initialData?.ticket || "",
      description: initialData?.description || "",
      capacity: initialData?.capacity || "Unlimited",
      capacityAmount: initialData?.capacityAmount,
      priceType: initialData?.priceType || "Free",
      priceAmount: initialData?.priceAmount,
      registrationDeadline: initialData?.registrationDeadline || undefined,
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<z.infer<
    typeof TicketSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const capacity = form.watch("capacity");
  const priceType = form.watch("priceType");

  const handleFormSubmit = (data: any) => {
    setPendingData(data);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingData) return;
    setIsLoading(true);

    setTimeout(() => {
      if (isUpdate && onUpdate) {
        const updatedTicket = { ...pendingData, id: initialData?.id };

        onUpdate(updatedTicket);

        showUpdateToast(updatedTicket, () => onUpdate(initialData));
      } else if (onCreate) {
        const newTicket = { ...pendingData, id: Date.now() };

        onCreate(newTicket);

        showCreateToast(newTicket.id, setTickets);
      }

      setIsLoading(false);
      setConfirmOpen(false);
      setModal(false);
      form.reset();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen flex items-center justify-center bg-black bg-opacity-50 px-[5%] overflow-hidden">
      <Card className="w-[45rem] rounded-[1rem] p-[16px] max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle>
            <h1 className="text-3xl text-blue-800 font-[700] mb-4">{title}</h1>
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Ticket Name */}
            <CardTitle className="flex flex-col gap-1 mb-6 px-[24px]">
              <FormField
                control={form.control}
                name="ticket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[700] !text-slate-700">
                      {titleName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Lorem Ipsum"
                        className="border-[#94A3B8] border-2 p-5 font-[400] rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>

            {/* Description */}
            <CardTitle className="flex flex-col gap-4 mb-8 px-[24px]">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[700] !text-slate-700">
                      {titleDesc}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="dolor sit amet..."
                        className="h-[9.5rem] border-[#94A3B8] border-2 p-5 font-[400] resize-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>

            {/* Capacity & Price */}
            <CardContent className="flex justify-between">
              <div className="flex flex-col gap-5">
                <Label className="font-[700]">Capacity</Label>
                <div className="px-2 flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-4">
                            <input
                              type="radio"
                              value="Unlimited"
                              checked={field.value === "Unlimited"}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue("capacityAmount", undefined);
                                form.clearErrors("capacityAmount");
                              }}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <Label className="font-[400]">Unlimited</Label>
                          </label>

                          <label className="flex items-center gap-4">
                            <input
                              type="radio"
                              value="Limited"
                              checked={field.value === "Limited"}
                              onChange={field.onChange}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <div className="flex items-center gap-[2rem]">
                              <Label className="font-[400]">Limited</Label>
                              <FormField
                                control={form.control}
                                name="capacityAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Enter Amount"
                                        disabled={capacity !== "Limited"}
                                        className="disabled:opacity-50"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* PRICE */}
              <div className="flex flex-col gap-5">
                <Label className="font-[700]">Price</Label>
                <div className="px-2 flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="priceType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-4">
                            <input
                              type="radio"
                              value="Free"
                              checked={field.value === "Free"}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue("priceAmount", undefined);
                                form.clearErrors("priceAmount");
                              }}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <Label className="font-[400]">Free</Label>
                          </label>

                          <label className="flex items-center gap-4">
                            <input
                              type="radio"
                              value="Paid"
                              checked={field.value === "Paid"}
                              onChange={field.onChange}
                              className="w-4 h-4 accent-blue-600"
                            />
                            <div className="flex items-center gap-[2.5rem]">
                              <Label className="font-[400]">Paid</Label>
                              <FormField
                                control={form.control}
                                name="priceAmount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="800"
                                        disabled={priceType !== "Paid"}
                                        className="disabled:opacity-50"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>

            {/* Registration Deadline */}
            <CardFooter className="flex flex-col gap-20">
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-[700] !text-slate-700">
                        Registration Deadline
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse md:flex-row justify-end w-full">
                <Button
                  variant="ghost"
                  type="button"
                  className="px-14 py-4 rounded-[6px] text-[0.875rem] font-medium"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-[#2563EB] px-14 py-4 rounded-[6px] text-[0.875rem] font-medium"
                >
                  {isUpdate ? "Update Ticket" : "Create Ticket"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={isUpdate ? "Confirm Ticket Update" : "Confirm Ticket Creation"}
        description={
          isUpdate
            ? "Are you sure you want to update this ticket?"
            : "Are you sure you want to create this ticket?"
        }
        confirmText={isUpdate ? "Yes, Update" : "Yes, Create"}
        cancelText="No, Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
