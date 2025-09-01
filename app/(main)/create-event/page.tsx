"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import type { CreateEventRequest } from "@/lib/types/requests/CreateEventRequest";
import { createEventService } from "@/lib/api/services/createEventService";
import { createEventSchema } from "@/lib/zod/create-event.schema";

export default function CreateEventPage() {
  const form = useForm<CreateEventRequest>({
    defaultValues: {
      name: "",
      description: "",
      dateStart: "",
      dateEnd: "",
      isRegistrationOpen: false,
      isRegistrationRequired: true,
      isOpenToOutsiders: false,
    },
    resolver: zodResolver(createEventSchema),
  });
  const router = useRouter();

  async function handleSubmit(data: CreateEventRequest) {
    await createEventService(data);
    router.push("events");
  }

  function handleCancel() {
    router.push("events");
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 min-w-96 p-4 border rounded m-4"
        >
          <header>
            <h1 className="text-xl font-bold">Create Event</h1>
            <p className="text-sm">
              Set up your event details and registration settings
            </p>
          </header>
          <hr />
          <fieldset>
            <legend className="mb-4 text-lg font-medium">Details</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Name" autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <hr />
          <fieldset>
            <legend className="mb-4 text-lg font-medium">Schedule</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="dateStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <hr />
          <fieldset>
            <legend className="mb-4 text-lg font-medium">Settings</legend>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isRegistrationOpen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Open registration</FormLabel>
                      <FormDescription>
                        Participants can join without registration.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isRegistrationRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Require registration</FormLabel>
                      <FormDescription>
                        Participants who want to join must register.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultChecked
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isOpenToOutsiders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Allow outsiders</FormLabel>
                      <FormDescription>
                        Participants outside Ateneo de Davao University can
                        join.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        defaultChecked
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <div className="flex flex-col space-y-2">
            <Button type="submit">Submit</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is irreversible. Any unsaved changes will be
                    permanently lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancel}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </Form>
    </>
  );
}
