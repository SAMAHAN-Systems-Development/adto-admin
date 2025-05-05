"use client";
import { useAddOrganization } from "@/client/mutations/organizationMutations";
import organizationSchema from "@/client/zod-schemas/organizationSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function NewOrganizationPage() {
  const { mutate: createOrganization, isPending } = useAddOrganization({
    onSuccess: () => {
      toast("success");
      router.push("/organizations");
    },
    onError: () => {
      toast("error");
    },
  });

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: "",
      organizationAcronym: "",
      organizationIcon: "",
      organizationDescription: "",
      facebookLink: "",
      twitterLink: "",
      linkedinLink: "",
    },
  });

  const handleAddOrganization = (data: z.infer<typeof organizationSchema>) => {
    createOrganization(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddOrganization)}>
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationAcronym"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Enter organization acronym" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationIcon"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="facebookLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Enter Facebook Link" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitterLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Enter Twitter Link" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Enter LinkedIn Link" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          onClick={() => console.log("clicked")}
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
