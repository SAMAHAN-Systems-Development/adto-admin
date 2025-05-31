"use client";

import { Event } from "@/client/types/entities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface ViewEventDetailsProps {
  event?: Event;
}

export default function ViewEventDetails({ event }: ViewEventDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger onClick={() => setIsOpen(true)}>
          View Event Details
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              View information about this event.
            </DialogDescription>
          </DialogHeader>

          {event ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Name:</p>
                <p className="col-span-2">{event.name}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Description:</p>
                <p className="col-span-2">{event.description}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Start Date:</p>
                <p className="col-span-2">{event.dateStart.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">End Date:</p>
                <p className="col-span-2">{event.dateEnd.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Registration:</p>
                <p className="col-span-2">
                  {event.isRegistrationOpen ? (
                    <span className="text-green-600">Open</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Required:</p>
                <p className="col-span-2">
                  {event.isRegistrationRequired ? "Yes" : "No"}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Open to Outsiders:</p>
                <p className="col-span-2">
                  {event.isOpenToOutsiders ? "Yes" : "No"}
                </p>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <p className="font-medium">Organization:</p>
                <p className="col-span-2">{event.org.name}</p>
              </div>

              <div className="flex justify-end pt-4">
                <Link href={`/events/${event.id}/edit`}>
                  <Button className="bg-secondary-100">Edit Event</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No event details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
