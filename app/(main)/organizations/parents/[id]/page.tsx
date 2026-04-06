"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@/lib/types/user-type";
import { AddParentOrganizationModal } from "@/components/features/organizations/parent-organization-modal-form";
import { organizationParentChildrenColumns } from "@/components/features/organizations/organization-parent-children-columns";
import { useOrganizationParentChildrenQuery } from "@/lib/api/queries/organizationsQueries";
import { useOrganizationParentQuery } from "@/lib/api/queries/organizationParentQueries";
import type { OrganizationGroup } from "@/lib/types/entities";

export default function ParentOrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: parentOrganization, isLoading: isParentLoading } =
    useOrganizationParentQuery(id);

  const { data, isLoading: isChildrenLoading, isFetching } =
    useOrganizationParentChildrenQuery(id, {
      page,
      limit,
    });

  const childOrganizations = useMemo(() => {
    const groups = (data?.data || []) as OrganizationGroup[];
    return groups.map((group) => group.organizationChild);
  }, [data]);

  const meta = data?.meta;

  if (isParentLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!parentOrganization) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-gray-900">Parent Organization Not Found</h1>
        <p className="text-gray-600 mt-2">
          The selected parent organization does not exist or is no longer available.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/organizations")}
          className="mt-6"
        >
          Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserType.ADMIN}>
      <div className="container mx-auto py-10">
        <Button
          variant="ghost"
          onClick={() => router.push("/organizations")}
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{parentOrganization.name}</h1>
            <p className="text-gray-600 max-w-3xl">
              {parentOrganization.description || "No description available."}
            </p>
          </div>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Parent Organization
          </Button>
        </div>

        <DataTable
          title=""
          columns={organizationParentChildrenColumns}
          data={childOrganizations}
          searchColumn="name"
          searchPlaceholder="Search organizations..."
          entityName="organizations"
          pagination={{
            page,
            limit,
            totalCount: meta?.totalCount || 0,
            totalPages: Math.max(meta?.totalPages || 1, 1),
            onPageChange: setPage,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1);
            },
          }}
          isTableLoading={isChildrenLoading || isFetching}
        />

        <AddParentOrganizationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          parentOrganization={parentOrganization}
        />
      </div>
    </ProtectedRoute>
  );
}
