"use client";

import { OrganizationChild } from "@/client/types/entities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface ViewDetailsButtonProps {
  organization?: OrganizationChild;
}

export default function ViewOrganizationDetails({
  organization,
}: ViewDetailsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger onClick={() => setIsOpen(true)}>
          View Organization Details
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>
              View information about this organization.
            </DialogDescription>
          </DialogHeader>

          {organization ? (
            <div className="grid gap-4 py-4">
              {organization.icon && (
                <div className="flex justify-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden">
                    <Image
                      src={organization.icon}
                      alt={`${organization.name} icon`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Name:</p>
                <p className="col-span-2">{organization.name}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Acronym:</p>
                <p className="col-span-2">{organization.acronym}</p>
              </div>

              {(organization.facebook ||
                organization.instagram ||
                organization.twitter ||
                organization.linkedin) && (
                <>
                  <p className="font-medium">Social Links:</p>
                  <div className="grid gap-2 pl-4">
                    {organization.facebook && (
                      <div className="grid grid-cols-3 items-center gap-4">
                        <p>Facebook:</p>
                        <a
                          href={organization.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline truncate"
                        >
                          {organization.facebook}
                        </a>
                      </div>
                    )}
                    {organization.instagram && (
                      <div className="grid grid-cols-3 items-center gap-4">
                        <p>Instagram:</p>
                        <a
                          href={organization.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline truncate"
                        >
                          {organization.instagram}
                        </a>
                      </div>
                    )}
                    {organization.twitter && (
                      <div className="grid grid-cols-3 items-center gap-4">
                        <p>Twitter:</p>
                        <a
                          href={organization.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline truncate"
                        >
                          {organization.twitter}
                        </a>
                      </div>
                    )}
                    {organization.linkedin && (
                      <div className="grid grid-cols-3 items-center gap-4">
                        <p>LinkedIn:</p>
                        <a
                          href={organization.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="col-span-2 text-blue-600 hover:underline truncate"
                        >
                          {organization.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="flex justify-end pt-4">
                {/* TODO: Implement edit functionality */}
                <Link href={`/organizations/${organization.id}/edit`}>
                  <Button className="bg-secondary-100">
                    Edit Organization
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No organization details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
