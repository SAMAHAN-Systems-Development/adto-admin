"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/data-table";
import { createOrganizationsColumns } from "@/components/features/organizations/organizations-columns";
import { ViewOrganizationModal } from "@/components/features/organizations/view-organization-modal";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useOrganizationsQuery } from "@/lib/api/queries/organizationsQueries";
import { useArchiveOrganizationMutation } from "@/lib/api/mutations/organizationsMutations";
import type { OrganizationChild } from "@/lib/types/entities";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function OrganizationsPage() {
  const router = useRouter();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationChild | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [organizationToArchive, setOrganizationToArchive] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(searchFilter, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error } = useOrganizationsQuery({
    page,
    limit,
    searchFilter: debouncedSearch,
    orderBy,
  });

  const organizations = data?.data || [];
  const meta = data?.meta;

  const archiveOrganizationMutation = useArchiveOrganizationMutation();

  const handleViewOrganization = (organization: OrganizationChild) => {
    setSelectedOrganization(organization);
    setIsViewModalOpen(true);
  };

  const handleEditOrganization = (organizationId: string) => {
    router.push(`/organizations/${organizationId}`);
  };

  const handleArchiveOrganization = (organizationId: string) => {
    setOrganizationToArchive(organizationId);
    setShowArchiveDialog(true);
  };

  const handleArchiveConfirm = async () => {
    if (organizationToArchive) {
      try {
        await archiveOrganizationMutation.mutateAsync(organizationToArchive);
        toast.success("Organization archived successfully", {
          description:
            "The organization has been removed from the active organizations list.",
        });
        setShowArchiveDialog(false);
        setOrganizationToArchive(null);
      } catch {
        toast.error("Failed to archive organization", {
          description:
            "An error occurred while archiving the organization. Please try again.",
        });
      }
    }
  };

  const handleArchiveCancel = () => {
    setShowArchiveDialog(false);
    setOrganizationToArchive(null);
  };

  const handleCreateOrganization = () => {
    router.push("/organizations/create");
  };

  const columns = createOrganizationsColumns({
    onArchiveOrganization: handleArchiveOrganization,
    onViewOrganization: handleViewOrganization,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Error loading organizations
          </h1>
          <p className="text-gray-600 mt-2">
            Failed to load organizations. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        title="Organizations"
        columns={columns}
        data={organizations}
        searchColumn="name"
        searchPlaceholder="Search organizations by name or acronym..."
        addButtonLabel="Add Organization"
        onCreateItem={handleCreateOrganization}
        entityName="organizations"
        search={{
          value: searchFilter,
          onSearchChange: setSearchFilter,
        }}
        sorting={{
          field: "name",
          order: orderBy,
          onSortChange: (field, order) => {
            setOrderBy(order);
            setPage(1); // Reset to first page when sorting changes
          },
        }}
        pagination={{
          page,
          limit,
          totalCount: meta?.totalCount || 0,
          totalPages: meta?.totalPages || 0,
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1); // Reset to first page when limit changes
          },
        }}
      />
      <ViewOrganizationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        organization={selectedOrganization}
        onEdit={() =>
          selectedOrganization && handleEditOrganization(selectedOrganization.id)
        }
      />
      <ConfirmationModal
        isOpen={showArchiveDialog}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        title="Archive Organization?"
        description="Are you sure you want to archive this organization? This action will remove it from the active organizations list."
        confirmText="Yes, archive organization"
        cancelText="No, keep organization"
        isLoading={archiveOrganizationMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
