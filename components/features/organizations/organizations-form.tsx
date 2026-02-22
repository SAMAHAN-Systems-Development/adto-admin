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
  CreateOrganizationSchema,
  UpdateOrganizationSchema,
  type OrganizationSchema as OrganizationType,
} from "@/lib/zod/organization.schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationParentsQuery } from "@/lib/api/queries/organizationParentQueries";
import { OrganizationParent } from "@/lib/types/entities";

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
  const { data: parentsResponse } = useOrganizationParentsQuery();
  const parents = parentsResponse || [];

  const schema = isEditMode ? UpdateOrganizationSchema : CreateOrganizationSchema;

  const form = useForm<OrganizationType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      acronym: "",
      email: "",
      password: "",
      organizationParentId: "",
      description: "",
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      twitter: "https://twitter.com/",
      linkedin: "https://linkedin.com/",
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditMode
                  ? "Change Password (leave blank to keep current)"
                  : "Password *"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    isEditMode
                      ? "Enter new password"
                      : "Minimum 8 characters"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationParentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Parent *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an organization parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parents.map((parent: OrganizationParent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
          {["facebook", "instagram", "twitter", "linkedin"].map((social) => (
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
