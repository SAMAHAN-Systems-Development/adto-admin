"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import AccountForm from "@/components/features/organizations/account-form";
import { useMyOrganizationQuery } from "@/lib/api/queries/accountQueries";
import { useUpdateMyOrganizationMutation } from "@/lib/api/mutations/accountMutations";
import type { AccountOrganizationSchema } from "@/lib/zod/organization.schema";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@/lib/types/user-type";

export default function AccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountOrganizationSchema | null>(
    null,
  );
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: organization, isLoading, error } = useMyOrganizationQuery();
  const updateMutation = useUpdateMyOrganizationMutation();

  // Transform fetched data to pre-populate form fields
  const defaultValues: Partial<AccountOrganizationSchema> | undefined =
    organization
      ? {
          name: organization.name ?? "",
          acronym: organization.acronym ?? "",
          email: organization.email ?? "",
          description: organization.description ?? "",
          facebook: organization.facebook ?? "",
          instagram: organization.instagram ?? "",
          twitter: organization.twitter ?? "",
          linkedin: organization.linkedin ?? "",
          password: "",
        }
      : undefined;

  // Step 1: form submit — choose which dialog to show
  const handleSubmit = (data: AccountOrganizationSchema) => {
    setFormData(data);
    if (data.password && data.password.length > 0) {
      // Password is being changed — require extra confirmation
      setShowPasswordDialog(true);
    } else {
      setShowSaveDialog(true);
    }
  };

  // Step 2a: password confirmation → then show generic save dialog
  const handlePasswordConfirm = () => {
    setShowPasswordDialog(false);
    setShowSaveDialog(true);
  };

  // Step 2b: final save confirmation
  const handleSaveConfirm = async () => {
    if (!formData) return;

    const payload: Partial<AccountOrganizationSchema> = { ...formData };

    // Omit password if it was left blank
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await updateMutation.mutateAsync(payload);
      toast.success("Account updated successfully", {
        description: "Your account information has been saved.",
      });
      setShowSaveDialog(false);
      setFormData(null);
    } catch {
      toast.error("Failed to update account", {
        description: "An error occurred. Please try again.",
      });
      setShowSaveDialog(false);
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    router.back();
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container w-full mt-14 ml-3">
        <h1 className="font-bold text-3xl mb-6">Account</h1>
        <div className="space-y-4">
          <div className="h-8 w-96 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Error / org not found state ──────────────────────────────────────────────
  if (error || !organization) {
    return (
      <div className="container w-full mt-14 ml-3">
        <h1 className="font-bold text-3xl mb-6">Account</h1>
        <p className="text-gray-600">
          Unable to load account information. Please refresh the page or contact
          support if the issue persists.
        </p>
      </div>
    );
  }

  // ── Main page ────────────────────────────────────────────────────────────────
  return (
    <ProtectedRoute requiredRole={UserType.ORGANIZATION}>
      <div className="container w-full mt-14 ml-3">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>

        <h1 className="font-bold text-3xl mb-2">Account</h1>
        <p className="text-gray-500 mb-8">
          Manage your organization&#39;s profile and account credentials.
        </p>

        <AccountForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={defaultValues}
          isSubmitting={updateMutation.isPending}
        />
      </div>

      {/* Password-change extra confirmation */}
      <ConfirmationModal
        isOpen={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordConfirm}
        title="Change Password?"
        description="You are about to change your account password. Make sure you remember the new password before saving."
        confirmText="Yes, change password"
        cancelText="No, keep current"
        variant="destructive"
      />

      {/* Save changes confirmation */}
      <ConfirmationModal
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleSaveConfirm}
        title="Save Changes"
        description="Are you sure you want to save these changes to your account?"
        confirmText="Save"
        cancelText="Cancel"
        isLoading={updateMutation.isPending}
        variant="default"
      />

      {/* Cancel / discard confirmation */}
      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        title="Discard Changes?"
        description="Are you sure you want to discard your changes? Unsaved changes will be lost."
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
        variant="destructive"
      />
    </ProtectedRoute>
  );
}
