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
import type { Registration } from "@/lib/types/entities";
import type { UpdateRegistrationRequest } from "@/lib/types/requests/RegistrationRequest";

interface EditRegistrationDialogProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateRegistrationRequest) => void;
  isLoading?: boolean;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (registration) {
      setFullName(registration.fullName);
      setEmail(registration.email);
      setYearLevel(registration.yearLevel);
      setCourse(registration.course);
      setCluster(registration.cluster);
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
