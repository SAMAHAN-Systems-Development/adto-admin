"use client";

import { archiveEventService } from "@/client/services/archiveEventService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

/**
 * The code below is temporary. Still waiting for events component.
 * @todo Integrate with events list.
 */
export default function EventsPage() {
  const [id, setId] = useState("");

  async function handleArchive() {
    await archiveEventService(id);
  }

  return (
    <>
      <Label>Event ID</Label>
      <Input onChange={(e) => setId(e.target.value)} placeholder="Event ID" />
      <div className="flex flex-col mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-black">Archive</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Any unsaved changes will be
                permanently lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchive}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
