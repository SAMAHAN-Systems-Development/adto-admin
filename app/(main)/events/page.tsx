"use client";

import { archiveEventService } from "@/client/services/archiveEventService";
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
    <div>
      <input
        className="border"
        type="text"
        placeholder="Enter Event ID"
        required
        onChange={(e) => setId(e.target.value)}
      />
      <button className="border" onClick={handleArchive}>
        Archive
      </button>
    </div>
  );
}
