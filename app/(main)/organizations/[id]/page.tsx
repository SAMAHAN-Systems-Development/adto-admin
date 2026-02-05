"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganizationsForm from "@/components/features/organizations/organizations-form";
import { OrganizationSchema } from "@/lib/zod/organization.schema";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useOrganizationQuery } from "@/lib/api/queries/organizationsQueries";
import { 
  useUpdateOrganizationMutation,
} from "@/lib/api/mutations/organizationsMutations";

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<OrganizationSchema | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Fetch organization data using React Query
  const { data: organization, isLoading } = useOrganizationQuery(id);
  const updateOrganizationMutation = useUpdateOrganizationMutation();

  // Transform organization data to match the form structure
  const transformedOrganization = organization ? {
    ...organization,
    email: organization.user?.email || "",
    organizationParentId: organization.organizationParents?.[0]?.organizationParentId || "",
  } : null;

  // Log organization data when it's fetched
  console.log("📊 Queried Organization Data:", organization);

  // Show dialog instead of updating immediately
  const handleSubmit = (data: OrganizationSchema) => {
    setFormData(data);
    setShowSubmitDialog(true);
  };

  // Run update when confirmed
  const confirmSubmit = async () => {
    if (!formData || !id) return;

    const updateData = {
      ...formData,
    };

    // Remove password if empty (don't update password if not provided)
    if (!updateData.password) {
      delete updateData.password;
    }

    console.log("📤 Sending Update Data No Icon:", {
      id,
      data: updateData,
    });

    await updateOrganizationMutation.mutateAsync({
      id,
      data: updateData,
    });

    setShowSubmitDialog(false);
    setFormData(null);
    router.push("/organizations");
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>

        <h1 className="font-bold text-3xl mb-6">Edit Organization</h1>

        <OrganizationsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={transformedOrganization}
          isSubmitting={updateOrganizationMutation.isPending}
          isEditMode={true}
        />
      </div>

      {/* Submit confirmation dialog */}
      <ConfirmationModal
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={confirmSubmit}
        title="Save Changes"
        description="Are you sure you want to save these changes to this organization?"
        confirmText="Save"
        cancelText="Cancel"
        isLoading={updateOrganizationMutation.isPending}
        variant="default"
      />

      {/* Cancel confirmation dialog */}
      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Discard Changes?"
        description="Are you sure you want to cancel editing this organization's information? New information will not be saved."
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
        variant="destructive"
      />
    </>
  );
}
