"use client";

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
  OrganizationSchema,
  type OrganizationSchema as OrganizationType,
} from "@/lib/zod/organization.schema";

interface OrganizationsFormProps {
  onSubmit: (data: OrganizationType) => void;
  onCancel: () => void;
  defaultValues?: Partial<OrganizationType>;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

export default function OrganizationsForm({
  onSubmit,
  onCancel,
  defaultValues,
  isSubmitting = false,
  isEditMode = false,
}: OrganizationsFormProps) {
  const form = useForm<OrganizationType>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      name: "",
      acronym: "",
      email: "",
      icon: null,
      description: "",
      facebook: "",
      instagram: "",
      x: "",
      linkedin: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormLabel>Organization Acronym</FormLabel>
              <FormControl>
                <Input placeholder="e.g., SYSDEV" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="org@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temporary Password *</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minimum 6 characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Description</FormLabel>
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

        <div className="grid grid-cols-1 gap-4">
          {["facebook", "instagram", "x", "linkedin"].map((social) => (
            <FormField
              key={social}
              control={form.control}
              name={social as keyof OrganizationType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {social.charAt(0).toUpperCase() + social.slice(1)} URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`https://${social}.com/...`}
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

        {/* <div className="flex space-x-6">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Organization</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAdmin"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Admin Organization</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div> */}

        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="outline" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
