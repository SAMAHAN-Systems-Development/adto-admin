"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizationParentsQuery } from "@/lib/api/queries/organizationParentQueries";
import { useOrganizationParentChildrenQuery } from "@/lib/api/queries/organizationsQueries";
import type { Registration } from "@/lib/types/entities";
import type { UpdateRegistrationRequest } from "@/lib/types/requests/RegistrationRequest";

interface EditRegistrationDialogProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateRegistrationRequest) => void;
  isLoading?: boolean;
}

interface OrganizationOption {
  id: string;
  name: string;
}

interface OrganizationGroupRow {
  organizationChild?: OrganizationOption;
}

interface OrganizationGroupOption {
  id: string;
  name: string;
}

export function EditRegistrationDialog({
  registration,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: EditRegistrationDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [course, setCourse] = useState("");
  const [cluster, setCluster] = useState("");
  const [organizationGroupId, setOrganizationGroupId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: organizationParentsResponse, isLoading: isOrganizationParentsLoading } =
    useOrganizationParentsQuery();
  const { data: organizationsResponse, isLoading: isOrganizationsLoading } =
    useOrganizationParentChildrenQuery(organizationGroupId, {
      page: 1,
      limit: 200,
    });

  const organizationGroupsRaw: unknown[] = Array.isArray(organizationParentsResponse)
    ? organizationParentsResponse
    : Array.isArray(organizationParentsResponse?.data)
      ? organizationParentsResponse.data
      : [];

  const organizationGroups: OrganizationGroupOption[] = organizationGroupsRaw.filter(
    (parent): parent is OrganizationGroupOption => {
      if (!parent || typeof parent !== "object") {
        return false;
      }

      const candidate = parent as { id?: unknown; name?: unknown };
      return typeof candidate.id === "string" && typeof candidate.name === "string";
    },
  );

  const organizationsByParentRaw: OrganizationGroupRow[] =
    Array.isArray(organizationsResponse?.data)
      ? organizationsResponse.data
      : Array.isArray(organizationsResponse)
        ? organizationsResponse
        : [];

  const organizationsByParent: OrganizationOption[] = organizationsByParentRaw
    .map((group) => group.organizationChild)
    .filter((organization): organization is OrganizationOption => Boolean(organization));

  const currentRegistrationOrganization: OrganizationOption | undefined =
    registration?.organizationChild
      ? {
          id: registration.organizationChild.id,
          name: registration.organizationChild.name,
        }
      : undefined;

  const organizationOptions =
    currentRegistrationOrganization &&
    !organizationsByParent.some(
      (organization) => organization.id === currentRegistrationOrganization.id,
    )
      ? [currentRegistrationOrganization, ...organizationsByParent]
      : organizationsByParent;

  useEffect(() => {
    if (registration) {
      setFullName(registration.fullName);
      setEmail(registration.email);
      setYearLevel(registration.yearLevel);
      setCourse(registration.course);
      setCluster(registration.cluster);
      setOrganizationGroupId(
        registration.organizationParentId ?? registration.organizationParent?.id ?? "",
      );
      setOrganizationId(
        registration.organizationChildId ?? registration.organizationChild?.id ?? "",
      );
      setErrors({});
    }
  }, [registration]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!yearLevel.trim()) newErrors.yearLevel = "Year level is required.";
    if (!course.trim()) newErrors.course = "Course is required.";
    if (!cluster.trim()) newErrors.cluster = "Cluster is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!registration || !validate()) return;

    const changed: UpdateRegistrationRequest = {};
    if (fullName.trim() !== registration.fullName) changed.fullName = fullName.trim();
    if (email.trim() !== registration.email) changed.email = email.trim();
    if (yearLevel.trim() !== registration.yearLevel) changed.yearLevel = yearLevel.trim();
    if (course.trim() !== registration.course) changed.course = course.trim();
    if (cluster.trim() !== registration.cluster) changed.cluster = cluster.trim();

    const currentOrganizationParentId =
      registration.organizationParentId ?? registration.organizationParent?.id ?? "";
    const currentOrganizationChildId =
      registration.organizationChildId ?? registration.organizationChild?.id ?? "";

    if (
      organizationGroupId &&
      organizationGroupId !== currentOrganizationParentId
    ) {
      changed.organizationParentId = organizationGroupId;
    }

    if (organizationId && organizationId !== currentOrganizationChildId) {
      changed.organizationChildId = organizationId;
    }

    if (Object.keys(changed).length === 0) {
      onClose();
      return;
    }

    onSave(registration.id, changed);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-semibold">
            Edit Registration
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base pt-1">
            Update participant information. Ticket category cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-900">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearLevel" className="text-sm font-medium text-gray-900">
                Year Level
              </Label>
              <Input
                id="yearLevel"
                value={yearLevel}
                onChange={(e) => {
                  setYearLevel(e.target.value);
                  setErrors((prev) => ({ ...prev, yearLevel: "" }));
                }}
                className={errors.yearLevel ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.yearLevel && (
                <p className="text-sm text-red-600">{errors.yearLevel}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster" className="text-sm font-medium text-gray-900">
                Cluster
              </Label>
              <Input
                id="cluster"
                value={cluster}
                onChange={(e) => {
                  setCluster(e.target.value);
                  setErrors((prev) => ({ ...prev, cluster: "" }));
                }}
                className={errors.cluster ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.cluster && (
                <p className="text-sm text-red-600">{errors.cluster}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course" className="text-sm font-medium text-gray-900">
              Course
            </Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setErrors((prev) => ({ ...prev, course: "" }));
              }}
              className={errors.course ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.course && (
              <p className="text-sm text-red-600">{errors.course}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Organization Group
              </Label>
              <Select
                value={organizationGroupId}
                onValueChange={(value) => {
                  setOrganizationGroupId(value);
                  setOrganizationId("");
                }}
                disabled={isLoading || isOrganizationParentsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization group" />
                </SelectTrigger>
                <SelectContent>
                  {organizationGroups.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Organization</Label>
              <Select
                value={organizationId}
                onValueChange={(value) => setOrganizationId(value)}
                disabled={
                  isLoading ||
                  !organizationGroupId ||
                  isOrganizationsLoading
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      organizationGroupId
                        ? "Select organization"
                        : "Select organization group first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizationOptions.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Ticket Category
            </Label>
            <Input
              value={registration?.ticketCategory?.name ?? ""}
              disabled
              className="bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
