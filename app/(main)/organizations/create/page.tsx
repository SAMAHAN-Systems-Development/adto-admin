"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OrganizationsForm from "@/components/features/organizations/organizations-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { OrganizationSchema as OrganizationType } from "@/lib/zod/organization.schema";
// import { createOrganizationService } from "@/lib/api/services/createOrganizationService";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrganizationType | null>(null);

  // When the form submits → open confirm dialog and store data
  const handleSubmit = async (data: OrganizationType) => {
    setFormData(data);
    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    if (!formData) return;

    try {
      setIsSubmitting(true);

      // Call the actual API service
      // await createOrganizationService(formData);

      toast("Organization created successfully.", {
        description: "The organization has been added to the system.",
      });

      router.push("/organizations");
    } catch (error) {
      console.error("Error creating organization:", error);
      toast("Failed to create organization. Please try again.", {
        description: "An error occurred while creating the organization.",
      });
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      setFormData(null);
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.push("/organizations");
  };

  return (
    <>
      <div className="font-figtree container w-full mt-14 ml-3">
        <h1 className=" font-bold text-3xl mb-6 ">Create Organization</h1>

        <OrganizationsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this organization?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSubmitDialog(false)}>
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Create Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel creating this organization?
              Information will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
