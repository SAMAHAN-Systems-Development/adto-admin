"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import OrganizationsForm from "@/components/features/organizations/organizations-form";
import { OrganizationSchema } from "@/lib/zod/organization.schema";
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

// Mock function to get organization by ID - replace with actual API call
function getOrganizationById(id: string): OrganizationSchema | null {
  const mockOrganizations = [
    {
      name: "Samahan Systems and Development",
      acronym: "SYSDEV",
      email: "samahan.sd@addu.edu.ph",
      description: "A student organization focused on systems development",
      facebook: "https://facebook.com/sysdev",
      instagram: "https://instagram.com/sysdev",
      x: "https://x.com/sysdev",
      linkedin: "https://linkedin.com/company/sysdev",
    },
    {
      name: "Organization X",
      acronym: "ORGX",
      email: "orgx@gmail.com",
      description: "Another organization",
      facebook: "",
      instagram: "",
      x: "",
      linkedin: "",
    },
  ];

  const index = parseInt(id) - 1;
  return mockOrganizations[index] || null;
}

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const [organization, setOrganization] = useState<OrganizationSchema | null>(
    null
  );
  const [formData, setFormData] = useState<OrganizationSchema | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;

    const storedOrg = sessionStorage.getItem("editOrganization");
    if (storedOrg) {
      try {
        const organizationData = JSON.parse(storedOrg) as OrganizationSchema;
        setOrganization(organizationData);
        setIsLoading(false);
        sessionStorage.removeItem("editOrganization");
        return;
      } catch (error) {
        console.error("Error parsing stored organization data:", error);
      }
    }

    const orgData = getOrganizationById(id);

    if (!orgData) {
      toast("Organization not found.", {
        description: "The requested organization could not be found.",
      });
      router.push("/organizations");
      return;
    }

    setOrganization(orgData);
    setIsLoading(false);
  }, [params.id, router]);

  // Show dialog instead of updating immediately
  const handleSubmit = (data: OrganizationSchema) => {
    setFormData(data);
    setShowSubmitDialog(true);
  };

  // Run update when confirmed
  const confirmSubmit = async () => {
    if (!formData) return;

    try {
      setIsSubmitting(true);

      // TODO: Replace with actual API call
      console.log("Updating organization:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast("Organization updated successfully.", {
        description: "The organization details have been saved.",
      });

      router.push("/organizations");
    } catch (error) {
      console.error("Error updating organization:", error);
      toast("Failed to update organization. Please try again.", {
        description: "An error occurred while updating the organization.",
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

  if (isLoading) {
    return (
      <div className="container w-full mt-14 ml-3">
        <h1 className="font-bold text-3xl mb-6">Edit Organization</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container w-full mt-14 ml-3">
        <h1 className="font-bold text-3xl mb-6">Edit Organization</h1>
        <div>Organization not found.</div>
      </div>
    );
  }

  return (
    <>
      <div className="container w-full mt-14 ml-3">
        <h1 className="font-bold text-3xl mb-6">Edit Organization</h1>

        <OrganizationsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={organization}
          isSubmitting={isSubmitting}
          isEditMode={true}
        />
      </div>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to edit this organization? Information will
              be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowSubmitDialog(false)}>
              No
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Edit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel editing this organization&apos;s
              information? New information will not be saved.
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
