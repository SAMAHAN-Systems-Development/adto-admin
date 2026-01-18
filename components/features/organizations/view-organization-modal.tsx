"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Instagram, Calendar, Clock } from "lucide-react";
import type { OrganizationChild } from "@/lib/types/entities";

interface ViewOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationChild | null;
  onEdit?: () => void;
}

export function ViewOrganizationModal({
  isOpen,
  onClose,
  organization,
  onEdit,
}: ViewOrganizationModalProps) {
  if (!organization) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {organization.name}
          </DialogTitle>
          <p className="text-muted-foreground text-base">
            {organization.acronym && `${organization.acronym} • `}
            {organization.email}
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Status</span>
              </div>
              <p className="text-foreground pl-7">
                {organization.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            {/* Date Created */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Date Created</span>
              </div>
              <p className="text-foreground pl-7">
                {new Date(organization.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          {organization.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {organization.description}
              </p>
            </div>
          )}

          {/* Social Media Links */}
          {(organization.facebook ||
            organization.linkedin ||
            organization.instagram ||
            organization.twitter) && (
            <div className="space-y-3">
              {organization.facebook && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-5 h-5" />
                    <span className="font-medium">Facebook</span>
                  </div>
                  <a
                    href={organization.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline pl-7 block"
                  >
                    {organization.facebook}
                  </a>
                </div>
              )}

              {organization.linkedin && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5" />
                    <span className="font-medium">Linkedin</span>
                  </div>
                  <a
                    href={organization.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline pl-7 block"
                  >
                    {organization.linkedin}
                  </a>
                </div>
              )}

              {organization.instagram && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5" />
                    <span className="font-medium">Instagram</span>
                  </div>
                  <a
                    href={organization.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline pl-7 block"
                  >
                    {organization.instagram}
                  </a>
                </div>
              )}

              {organization.twitter && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="font-medium">X (Twitter)</span>
                  </div>
                  <a
                    href={organization.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground hover:underline pl-7 block"
                  >
                    {organization.twitter}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-6">
          {onEdit && (
            <Button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit organization
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
