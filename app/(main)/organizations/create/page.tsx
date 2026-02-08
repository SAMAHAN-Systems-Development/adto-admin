"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrganizationsForm from "@/components/features/organizations/organizations-form";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import type { OrganizationSchema as OrganizationType } from "@/lib/zod/organization.schema";
import { useCreateOrganizationMutation } from "@/lib/api/mutations/organizationsMutations";
import type { CreateOrganizationRequest } from "@/lib/types/requests/OrganizationRequests";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [formData, setFormData] = useState<OrganizationType | null>(null);

  const createOrganizationMutation = useCreateOrganizationMutation();

  const handleSubmit = (data: OrganizationType) => {
    setFormData(data);
    setShowSubmitDialog(true);
  };

  const confirmSubmit = async () => {
    if (!formData) return;

    const requestData: CreateOrganizationRequest = {
      name: formData.name,
      acronym: formData.acronym,
      email: formData.email,
      password: formData.password,
      organizationParentId: formData.organizationParentId,
      description: formData.description || "",
      facebook: formData.facebook || "",
      instagram: formData.instagram || "",
      twitter: formData.twitter || "",
      linkedin: formData.linkedin || "",
      isAdmin: false,
    };

    await createOrganizationMutation.mutateAsync(requestData);
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

  return (
    <>
      <div className="font-figtree container w-full mt-14 ml-3">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>

        <h1 className=" font-bold text-3xl mb-6 ">Create Organization</h1>

        <OrganizationsForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createOrganizationMutation.isPending}
        />
      </div>

      {/* Submit confirmation dialog */}
      <ConfirmationModal
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={confirmSubmit}
        title="Create Organization"
        description="Are you sure you want to create this organization?"
        confirmText="Create"
        cancelText="Cancel"
        isLoading={createOrganizationMutation.isPending}
        variant="default"
      />

      {/* Cancel confirmation dialog */}
      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancel}
        title="Discard Changes?"
        description="Are you sure you want to cancel creating this organization? Information will not be saved."
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
        variant="destructive"
      />
    </>
  );
}
