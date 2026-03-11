"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AccountOrganizationSchema,
  type AccountOrganizationSchema as AccountOrganizationSchemaType,
} from "@/lib/zod/organization.schema";

interface AccountFormProps {
  onSubmit: (data: AccountOrganizationSchemaType) => void;
  onCancel: () => void;
  defaultValues?: Partial<AccountOrganizationSchemaType>;
  isSubmitting?: boolean;
}

export default function AccountForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
}: AccountFormProps) {
  const form = useForm<AccountOrganizationSchemaType>({
    resolver: zodResolver(AccountOrganizationSchema),
    defaultValues: {
      name: "",
      acronym: "",
      email: "",
      password: "",
      description: "",
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/",
      ...defaultValues,
    },
  });

  // Reset form when defaultValues change (e.g., after success refetch)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
        {/* Organization Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Organization Information
          </h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., SYSDEV" {...field} />
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
                    <Textarea
                      placeholder="Brief description of the organization"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Account Credentials */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Account Credentials
          </h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="org@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Change Password{" "}
                    <span className="text-gray-400 font-normal text-sm">
                      (leave blank to keep current)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Minimum 8 characters"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Social Media Links
          </h2>
          <div className="space-y-4">
            {(
              [
                { name: "facebook", label: "Facebook" },
                { name: "instagram", label: "Instagram" },
                { name: "twitter", label: "Twitter / X" },
                { name: "linkedin", label: "LinkedIn" },
              ] as const
            ).map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label} URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`https://${name === "twitter" ? "twitter.com" : `${name}.com`}/...`}
                        {...field}
                        value={String(field.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Exit
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
