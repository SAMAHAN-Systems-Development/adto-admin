"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateOrganizationParentMutation, useUpdateOrganizationParentMutation } from "@/lib/api/mutations/organizationParentMutations";
import { toast } from "sonner";
import type { OrganizationParent } from "@/lib/types/entities";

interface AddParentOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentOrganization?: OrganizationParent | null;
}

export function AddParentOrganizationModal({
  isOpen,
  onClose,
  parentOrganization,
}: AddParentOrganizationModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useCreateOrganizationParentMutation();
  const updateMutation = useUpdateOrganizationParentMutation();

  const isEditMode = !!parentOrganization;

  // Pre-populate form when editing
  useEffect(() => {
    if (parentOrganization) {
      setName(parentOrganization.name);
      setDescription(parentOrganization.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [parentOrganization, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Validation Error", {
        description: "Parent Organization Name is required.",
      });
      return;
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: parentOrganization.id,
          data: {
            name: name.trim(),
            description: description.trim(),
          },
        });

        toast.success("Success", {
          description: "Parent organization updated successfully!",
        });
      } else {
        await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
        });

        toast.success("Success", {
          description: "Parent organization created successfully!",
        });
      }

      // Reset form and close modal
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      toast.error("Error", {
        description: `Failed to ${isEditMode ? "update" : "create"} parent organization. Please try again.`,
      });
      console.error(`Failed to ${isEditMode ? "update" : "create"} parent organization:`, error);
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {isEditMode ? "Edit Parent Organization" : "Add Parent Organization"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Parent Organization Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">
              Parent Organization Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lorem Ipsum"
              className="w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description here"
              className="w-full min-h-[120px] resize-none"
              rows={5}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isPending}
            >
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Update Parent Organization"
                  : "Add Parent Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
