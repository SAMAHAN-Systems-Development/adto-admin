"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CreateTicket from "@/components/shared/CreateTicket";
import CardTicket from "@/components/shared/CardTicket";

export default function Home() {
  const [modal, setModal] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  const handleCreateTicket = (data: any) => {
    const newTicket = { ...data, id: Date.now() };
    setTickets((prev) => [...prev, newTicket]);
  };

  const handleUpdateTicket = (updated: any) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
  };

  return (
    <div className="p-10">
      <Toaster position="bottom-right" />
      <div className="flex justify-end w-full">
        <button
          onClick={() => setModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Ticket
        </button>
      </div>

      {modal && (
        <CreateTicket
          setModal={setModal}
          title="Create Ticket"
          titleName="Title Name"
          titleDesc="Description"
          onCreate={handleCreateTicket}
          setTickets={setTickets}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
        {tickets.map((ticket) => (
          <CardTicket
            key={ticket.id}
            ticket={ticket}
            setTickets={setTickets}
            onUpdate={handleUpdateTicket}
          />
        ))}
      </div>
    </div>
  );
}
