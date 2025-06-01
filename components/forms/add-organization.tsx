"use client";
import { useAddOrganization } from "@/client/mutations/organizationMutations";
import organizationSchema from "@/client/schemas/organization-schema";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function AddOrganizationPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      name: "",
      acronym: "",
      icon: "",
      links: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
      },
    },
  });

  const handleAddOrganization = (data: z.infer<typeof organizationSchema>) => {
    createOrganization(data);
  };

  const handleCancel = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    router.push("/organizations");
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddOrganization)}
          className="space-y-8 w-full max-w-7xl mx-auto"
        >
          <h1 className="text-2xl font-bold">Create New Organization</h1>
          <div className="">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your organization display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acronym</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization acronym"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Icon</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links (Optional)</h3>

            <FormField
              control={form.control}
              name="links.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://twitter.com/..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links.linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-28"
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">
                    Are you sure you want to cancel the creation of this
                    organization?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center"></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center ">
                  <AlertDialogCancel className="w-28">No</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-secondary-100 w-28"
                    onClick={handleConfirmCancel}
                  >
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button className="bg-secondary-100 w-28" type="submit">
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
