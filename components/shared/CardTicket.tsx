"use client";

import { useState } from "react";
import { XIcon, Archive, SquarePen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateTicket from "@/components/shared/CreateTicket";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

function CardModalDetails({
  ticket,
  isOpen,
  onClose,
  setTickets,
  onUpdate,
  onDelete,
}: {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
  setTickets: React.Dispatch<React.SetStateAction<any[]>>;
  onUpdate: (updated: any) => void;
  onDelete: (id: string) => void;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  if (!isOpen) return null;

  const handleUpdateTicket = (updated: any) => {
    updated.id = ticket.id;
    onUpdate(updated);
    setUpdateOpen(false);
    onClose();
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onDelete(ticket.id);
      setArchiveOpen(false);
      onClose();
    } catch (error) {
      console.error("Failed to archive ticket:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      {/* Ticket Details Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5">
        <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">{ticket.ticket}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setArchiveOpen(true)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Archive
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setUpdateOpen(true)}
              >
                Update Ticket
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <span className="text-sm font-medium text-gray-500">Capacity</span>
              <p className="text-lg font-semibold text-gray-700">
                {ticket.capacity === "Limited"
                  ? `${ticket.capacityAmount} pax`
                  : "Unlimited"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Price</span>
              <p className="text-lg font-semibold text-gray-700">
                {ticket.priceType === "Paid"
                  ? `₱${Number(ticket.priceAmount).toFixed(2)}`
                  : "Free"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Registration Deadline
              </span>
              <p className="text-lg font-semibold text-gray-700">
                {ticket.registrationDeadline
                  ? new Date(ticket.registrationDeadline).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "None"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Ticket Details</h3>
            <p className="text-gray-700">{ticket.description}</p>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {updateOpen && (
        <CreateTicket
          setModal={setUpdateOpen}
          title="Update Ticket"
          titleName="Ticket Name"
          titleDesc="Description"
          onUpdate={handleUpdateTicket}
          setTickets={setTickets}
          initialData={ticket}
          isUpdate
        />
      )}

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        onConfirm={handleArchive}
        title="Archive Ticket"
        description="Are you sure you want to archive this ticket? This action will remove it from the active tickets list."
        confirmText="Archive Ticket"
        cancelText="Cancel"
        isLoading={isArchiving}
        variant="destructive"
      />
    </>
  );
}

export default function CardTicket({
  ticket,
  setTickets,
  onUpdate,
  onDelete,
}: {
  ticket: any;
  setTickets: React.Dispatch<React.SetStateAction<any[]>>;
  onUpdate: (updated: any) => void;
  onDelete: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleUpdateTicket = (updated: any) => {
    updated.id = ticket.id;
    onUpdate(updated);
    setUpdateOpen(false);
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onDelete(ticket.id);
      setArchiveOpen(false);
    } catch (error) {
      console.error("Failed to archive ticket:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  const ticketDetails = [
    {
      label: "Capacity",
      value: ticket.capacity === "Limited" ? `${ticket.capacityAmount} pax` : "Unlimited",
      hasBorder: false,
    },
    {
      label: "Price",
      value: ticket.priceType === "Paid" ? `₱${Number(ticket.priceAmount).toFixed(2)}` : "Free",
      hasBorder: true,
    },
    {
      label: "Registration Deadline",
      value: ticket.registrationDeadline
        ? new Date(ticket.registrationDeadline).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "None",
      hasBorder: false,
    },
  ];

  return (
    <>
      <Card className="border-[#94A3B8] cursor-pointer" onClick={() => setModalOpen(true)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="lg:text-2xl font-bold text-[#1E293B]">
              {ticket.ticket}
            </CardTitle>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setArchiveOpen(true);
                }}
              >
                <Archive className="w-5 h-5 text-blue-600" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateOpen(true);
                }}
              >
                <SquarePen className="w-5 h-5 text-blue-600" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-6">
            {ticketDetails.map((detail, index) => (
              <div
                key={index}
                className={`
                  flex flex-col gap-1
                  ${detail.hasBorder ? "lg:border-l-2 lg:border-r-2 lg:px-6" : ""}
                  ${!detail.hasBorder && index > 0 ? "lg:pl-6" : ""}
                `}
              >
                <span className="text-sm lg:text-[0.8vw] font-normal text-[#94A3B8] whitespace-nowrap">
                  {detail.label}
                </span>
                <span className="text-base lg:text-[0.8rem] font-semibold text-[#64748B] break-keep">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <CardModalDetails
        ticket={ticket}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        setTickets={setTickets}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      {/* Quick Update Modal */}
      {updateOpen && (
        <CreateTicket
          setModal={setUpdateOpen}
          title="Update Ticket"
          titleName="Ticket Name"
          titleDesc="Description"
          onUpdate={handleUpdateTicket}
          setTickets={setTickets}
          initialData={ticket}
          isUpdate
        />
      )}

      {/* Quick Archive Confirmation */}
      <ConfirmationModal
        isOpen={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        onConfirm={handleArchive}
        title="Archive Ticket"
        description="Are you sure you want to archive this ticket? This action will remove it from the active tickets list."
        confirmText="Archive Ticket"
        cancelText="Cancel"
        isLoading={isArchiving}
        variant="destructive"
      />
    </>
  );
}