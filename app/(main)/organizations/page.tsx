"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DataTable } from "@/components/shared/data-table";
import { createOrganizationsColumns } from "@/components/features/organizations/organizations-columns";
import { createOrganizationParentsColumns } from "@/components/features/organizations/organizationParents-columns";
import { ViewOrganizationModal } from "@/components/features/organizations/view-organization-modal";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useOrganizationsQuery } from "@/lib/api/queries/organizationsQueries";
import { useArchiveOrganizationMutation } from "@/lib/api/mutations/organizationsMutations";
import type { OrganizationChild, OrganizationParent } from "@/lib/types/entities";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationParentsQuery } from "@/lib/api/queries/organizationParentQueries";

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

  // Parent Organizations pagination state
  const [parentPage, setParentPage] = useState(1);
  const [parentLimit, setParentLimit] = useState(20);
  const [parentSearchFilter, setParentSearchFilter] = useState("");
  const [parentOrderBy, setParentOrderBy] = useState<"asc" | "desc">("asc");

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  const debouncedSearch = useDebounce(searchFilter, 500);
  const debouncedParentSearch = useDebounce(parentSearchFilter, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    setParentPage(1);
  }, [debouncedParentSearch]);

  const { data, isLoading, error, isFetching } = useOrganizationsQuery({
    page,
    limit,
    searchFilter: debouncedSearch,
    orderBy,
  });

  const { data: organizationParentData, isLoading: isParentsLoading } = useOrganizationParentsQuery();

  console.log("Organization parents data:", organizationParentData);
  const organizations = data?.data || [];
  const meta = data?.meta;

  // Client-side pagination and filtering for parent organizations
  const paginatedParentOrgs = useMemo(() => {
    let filtered = organizationParentData || [];

    // Apply search filter
    if (debouncedParentSearch) {
      filtered = filtered.filter((parentorg: OrganizationParent) =>
        parentorg.name.toLowerCase().includes(debouncedParentSearch.toLowerCase()) ||
        parentorg.description?.toLowerCase().includes(debouncedParentSearch.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return parentOrderBy === "asc" ? comparison : -comparison;
    });

    // Calculate pagination
    const startIndex = (parentPage - 1) * parentLimit;
    const endIndex = startIndex + parentLimit;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      data: paginated,
      totalCount: sorted.length,
      totalPages: Math.ceil(sorted.length / parentLimit),
    };
  }, [organizationParentData, debouncedParentSearch, parentOrderBy, parentPage, parentLimit]);

  // After first successful load, mark as no longer initial
  useEffect(() => {
    if (data && isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [data]);

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

  const handleViewParentOrganization = (parentOrg: OrganizationParent) => {
    console.log("View parent organization:", parentOrg);
    // TODO: Implement parent organization view modal
  };

  const handleArchiveParentOrganization = (parentOrgId: string) => {
    console.log("Archive parent organization:", parentOrgId);
    // TODO: Implement parent organization archive logic
  };

  const handleCreateParentOrganization = () => {
    router.push("/organizations/parents/create");
  };

  const columns = createOrganizationsColumns({
    onArchiveOrganization: handleArchiveOrganization,
    onViewOrganization: handleViewOrganization,
  });

  const parentColumns = createOrganizationParentsColumns({
    onArchiveOrganizationParent: handleArchiveParentOrganization,
    onViewOrganizationParent: handleViewParentOrganization,
  });

  // Only show full page loading skeleton on initial load
  if (isLoading && isInitialLoad.current) {
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
      <Tabs defaultValue="organizations" className="w-full">
        <TabsList>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="parent-organizations">Parent Organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="mt-6">
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
            onRowClick={(organization) => handleViewOrganization(organization)}
            isTableLoading={isFetching && !isInitialLoad.current}
          />
        </TabsContent>

        <TabsContent value="parent-organizations" className="mt-6">
          <DataTable
            title="Parent Organizations"
            columns={parentColumns}
            data={paginatedParentOrgs.data}
            searchColumn="name"
            searchPlaceholder="Search parent organizations..."
            addButtonLabel="Add Parent Organization"
            onCreateItem={handleCreateParentOrganization}
            entityName="parent-organizations"
            search={{
              value: parentSearchFilter,
              onSearchChange: setParentSearchFilter,
            }}
            sorting={{
              field: "name",
              order: parentOrderBy,
              onSortChange: (field, order) => {
                setParentOrderBy(order);
                setParentPage(1);
              },
            }}
            pagination={{
              page: parentPage,
              limit: parentLimit,
              totalCount: paginatedParentOrgs.totalCount,
              totalPages: paginatedParentOrgs.totalPages,
              onPageChange: setParentPage,
              onLimitChange: (newLimit) => {
                setParentLimit(newLimit);
                setParentPage(1);
              },
            }}
            onRowClick={(parentOrg) => handleViewParentOrganization(parentOrg)}
            isTableLoading={isParentsLoading}
          />
        </TabsContent>
      </Tabs>

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