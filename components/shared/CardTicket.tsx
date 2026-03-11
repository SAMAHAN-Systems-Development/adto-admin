"use client";

import { useState } from "react";
import { XIcon, Archive, SquarePen, Download, Copy, Check, Clock, CheckCircle2, XCircle, Send } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import CreateTicket from "@/components/shared/CreateTicket";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { Tickets } from "@/lib/types/requests/ticketsRequests";
import { deleteAsset } from "@/lib/api/services/assetService";
import { useCreateTicketRequestMutation, useCancelTicketRequestMutation } from "@/lib/api/mutations/ticketRequestMutation";
import toast from "react-hot-toast";

function TicketRequestStatus({ ticket }: { ticket: Tickets }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);
  const createRequestMutation = useCreateTicketRequestMutation();
  const cancelRequestMutation = useCancelTicketRequestMutation();
  const latestRequest = ticket.latestRequest;

  const handleCopyLink = () => {
    if (latestRequest?.ticketLink) {
      navigator.clipboard.writeText(latestRequest.ticketLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRequestLink = async () => {
    try {
      await createRequestMutation.mutateAsync(ticket.id);
      toast.success("Ticket request sent successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send request";
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await cancelRequestMutation.mutateAsync(requestId);
      toast.success("Ticket request cancelled successfully", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cancel request";
      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-right",
      });
      console.error(error);
    }
  };

  const renderContent = () => {
    // No request exists
    if (!latestRequest) {
      return (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                Ticket Link Request
              </p>
              <p className="text-xs text-gray-500 max-w-[250px]">
                Paid tickets require a verified link from the superadmin.
              </p>
            </div>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
              onClick={() => setShowRequestConfirm(true)}
              disabled={createRequestMutation.isPending}
            >
              {createRequestMutation.isPending ? "Requesting..." : "Request Ticket Link"}
            </button>
          </div>
        </div>
      );
    }

    // Pending
    if (latestRequest.status === "PENDING") {
      return (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700">Request Pending</p>
                <p className="text-xs text-gray-500">
                  Waiting for Superadmin approval
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleCancelRequest(latestRequest.id)}
              disabled={cancelRequestMutation.isPending}
              variant="outline"
              size="sm"
              className="border-red-600 text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              {cancelRequestMutation.isPending ? "Cancelling..." : "Cancel Request"}
            </Button>
          </div>
        </div>
      );
    }

    // Approved
    if (latestRequest.status === "APPROVED" && latestRequest.ticketLink) {
      return (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-green-700">Request Approved</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-2 bg-gray-50 border rounded-md text-sm text-gray-600 truncate">
              <a
                href={latestRequest.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {latestRequest.ticketLink}
              </a>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex items-center gap-1 shrink-0"
            >
              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {isCopied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      );
    }

    // Declined
    if (latestRequest.status === "DECLINED") {
      return (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-medium text-red-600">Request Declined</p>
          </div>
          {latestRequest.declineReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">Reason: </span>
                {latestRequest.declineReason}
              </p>
            </div>
          )}
          <Button
            onClick={() => setShowRequestConfirm(true)}
            disabled={createRequestMutation.isPending}
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {createRequestMutation.isPending ? "Sending..." : "Request Again"}
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {renderContent()}

      {/* Confirmation Modal for Request */}
      <ConfirmationModal
        isOpen={showRequestConfirm}
        onClose={() => setShowRequestConfirm(false)}
        onConfirm={() => {
          setShowRequestConfirm(false);
          handleRequestLink();
        }}
        title="Confirm Ticket Details"
        description="Please ensure all ticket information is correct. Once requested, the ticket details cannot be edited until the request is processed by a superadmin."
        confirmText="Yes, Request Link"
        cancelText="Cancel"
        isLoading={createRequestMutation.isPending}
      />
    </>
  );
}

function CardModalDetails({
  ticket,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: {
  ticket: Tickets;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Tickets) => void;
  onDelete: (id: string) => void;
}) {
  const [updateOpen, setUpdateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showThumbnailDeleteConfirm, setShowThumbnailDeleteConfirm] =
    useState(false);

  const isPending = ticket.latestRequest?.status === "PENDING";
  const isApproved = ticket.latestRequest?.status === "APPROVED";
  const isRequestActive = isPending || isApproved;

  if (!isOpen) return null;

  // Helper function to extract S3 key from Supabase URL
  const extractKeyFromUrl = (url: string): string => {
    try {
      const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
      if (match) {
        return match[1];
      }
      return url.split("/").pop() || "";
    } catch (error) {
      console.error("Error extracting key from URL:", error);
      return url.split("/").pop() || "";
    }
  };

  const handleDeleteThumbnail = async () => {
    if (ticket.thumbnail) {
      try {
        const thumbnailKey = extractKeyFromUrl(ticket.thumbnail);
        console.log("Deleting ticket thumbnail with key:", thumbnailKey);

        if (thumbnailKey) {
          await deleteAsset(thumbnailKey);
          console.log("Ticket thumbnail deleted from storage successfully");
        }

        // Update the ticket to remove thumbnail
        const updatedTicket = { ...ticket, thumbnail: "" };
        onUpdate(updatedTicket);
        console.log("Ticket thumbnail removed successfully!");
      } catch (error) {
        console.error("Failed to delete ticket thumbnail:", error);
      }
    }
    setShowThumbnailDeleteConfirm(false);
  };

  const handleUpdateTicket = (updated: Tickets) => {
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

  const handleDownloadImage = () => {
    if (!ticket.thumbnail) return;

    const link = document.createElement("a");
    link.href = ticket.thumbnail;
    link.download = `${ticket.name}-ticket-image.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Ticket Details Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5">
        <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-700">{ticket.name}</h2>
            <div className="flex items-center gap-3">
              {isRequestActive ? (
                <div className="hidden sm:block">
                  <span className="text-xs text-gray-500 italic mr-2 border border-yellow-200 bg-yellow-50 px-2 py-1 rounded">
                    Modification locked during active request
                  </span>
                </div>
              ) : null}
              <button
                onClick={() => setArchiveOpen(true)}
                disabled={isRequestActive}
                className={`px-4 py-2 border border-gray-300 rounded ${isRequestActive ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400" : "hover:bg-gray-50"}`}
                title={isRequestActive ? "Cancel request to archive" : "Archive Ticket"}
              >
                Archive
              </button>
              <button
                disabled={isRequestActive}
                className={`px-4 py-2 text-white rounded ${isRequestActive ? "opacity-50 cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                onClick={() => setUpdateOpen(true)}
                title={isRequestActive ? "Cancel request to edit" : "Update Ticket"}
              >
                Update Ticket
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Ticket Thumbnail */}
          {ticket.thumbnail && (
            <div className="mb-6">
              <div className="w-full max-h-96 relative overflow-hidden rounded-lg group">
                <Image
                  src={ticket.thumbnail}
                  alt={ticket.name}
                  width={800}
                  height={384}
                  className="w-full max-h-96 object-cover"
                />
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowThumbnailDeleteConfirm(true);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                  title="Remove thumbnail"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between mb-6">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Capacity
              </span>
              <p className="text-lg font-semibold text-gray-700">
                {ticket.capacity} Pax
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Price</span>
              <p className="text-lg font-semibold text-gray-700">
                ₱ {ticket.price}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500">
                Registration Deadline
              </span>
              <p className="text-lg font-semibold text-gray-700">
                {ticket.registrationDeadline
                  ? new Date(ticket.registrationDeadline).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "None"}
              </p>
            </div>
          </div>
          <hr />
          <div>
            <h3 className="font-semibold my-2">Ticket Details</h3>
            <p className="text-gray-700">{ticket.description}</p>
          </div>

          {/* Ticket Request Status Section */}
          {ticket.price > 0 ? (
            <TicketRequestStatus ticket={ticket} />
          ) : (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">Free Ticket</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                No ticket link request needed for free events.
              </p>
            </div>
          )}
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

      {/* Delete Thumbnail Confirmation Modal */}
      <ConfirmationModal
        isOpen={showThumbnailDeleteConfirm}
        onClose={() => setShowThumbnailDeleteConfirm(false)}
        onConfirm={handleDeleteThumbnail}
        title="Remove Ticket Thumbnail"
        description="Are you sure you want to remove the ticket thumbnail? This action cannot be undone."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        isLoading={false}
        variant="destructive"
      />
    </>
  );
}

export default function CardTicket({
  ticket,
  onUpdate,
  onDelete,
}: {
  ticket: Tickets;
  onUpdate: (updated: Tickets) => void;
  onDelete: (id: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showThumbnailDeleteConfirm, setShowThumbnailDeleteConfirm] =
    useState(false);

  // Helper function to extract S3 key from Supabase URL
  const extractKeyFromUrl = (url: string): string => {
    try {
      const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
      if (match) {
        return match[1];
      }
      return url.split("/").pop() || "";
    } catch (error) {
      console.error("Error extracting key from URL:", error);
      return url.split("/").pop() || "";
    }
  };

  const handleDeleteThumbnail = async () => {
    if (ticket.thumbnail) {
      try {
        const thumbnailKey = extractKeyFromUrl(ticket.thumbnail);
        console.log("Deleting ticket thumbnail with key:", thumbnailKey);

        if (thumbnailKey) {
          await deleteAsset(thumbnailKey);
          console.log("Ticket thumbnail deleted from storage successfully");
        }

        // Update the ticket to remove thumbnail
        const updatedTicket = { ...ticket, thumbnail: "" };
        onUpdate(updatedTicket);
        console.log("Ticket thumbnail removed successfully!");
      } catch (error) {
        console.error("Failed to delete ticket thumbnail:", error);
      }
    }
    setShowThumbnailDeleteConfirm(false);
  };

  const handleUpdateTicket = (updated: Tickets) => {
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

  // Get status badge for the card
  const isPending = ticket.latestRequest?.status === "PENDING";
  const isApproved = ticket.latestRequest?.status === "APPROVED";
  const isRequestActive = isPending || isApproved;

  const getStatusBadge = () => {
    if (ticket.price === 0) return null;

    const req = ticket.latestRequest;
    if (!req) return null;

    if (req.status === "PENDING") {
      return (
        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
    }
    if (req.status === "APPROVED") {
      return (
        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Approved
        </span>
      );
    }
    if (req.status === "DECLINED") {
      return (
        <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Declined
        </span>
      );
    }
    return null;
  };

  const ticketDetails = [
    {
      label: "Capacity",
      value: ticket.capacity,
      hasBorder: false,
    },
    {
      label: "Price",
      value: "₱ " + ticket.price,
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
      <Card
        className="border-[#94A3B8] cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Ticket Thumbnail */}
          <div className="flex-shrink-0 self-center sm:self-start">
            {ticket.thumbnail ? (
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 relative group">
                <Image
                  src={ticket.thumbnail}
                  alt={ticket.name}
                  fill
                  className="object-cover"
                />
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowThumbnailDeleteConfirm(true);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10 text-xs"
                  title="Remove thumbnail"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-xs text-gray-500 text-center">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-4">
                <CardTitle className="lg:text-2xl font-bold text-[#1E293B] truncate">
                  {ticket.name}
                </CardTitle>
                {getStatusBadge()}
              </div>
              <div
                className="flex gap-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isRequestActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    setArchiveOpen(true);
                  }}
                  title={isRequestActive ? "Cannot archive while request is active" : "Archive Ticket"}
                >
                  <Archive className={`w-5 h-5 ${isRequestActive ? "text-gray-400" : "text-blue-600"}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isRequestActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    setUpdateOpen(true);
                  }}
                  title={isRequestActive ? "Cannot edit while request is active" : "Update Ticket"}
                >
                  <SquarePen className={`w-5 h-5 ${isRequestActive ? "text-gray-400" : "text-blue-600"}`} />
                </Button>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              {ticketDetails.map((detail, index) => (
                <div
                  key={index}
                  className={`
                    flex flex-col gap-1
                    ${index === 2 ? "flex-1 min-w-0" : "min-w-[5rem]"}
                    ${detail.hasBorder ? "sm:border-l-2 sm:border-r-2 sm:px-3" : ""}
                    ${!detail.hasBorder && index > 0 ? "sm:pl-3" : ""}
                  `}
                >
                  <span className="text-xs lg:text-sm font-normal text-[#94A3B8] whitespace-nowrap">
                    {detail.label}
                  </span>
                  <span className="text-sm lg:text-base font-semibold text-[#64748B]">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      <CardModalDetails
        ticket={ticket}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
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

      {/* Delete Thumbnail Confirmation Modal */}
      <ConfirmationModal
        isOpen={showThumbnailDeleteConfirm}
        onClose={() => setShowThumbnailDeleteConfirm(false)}
        onConfirm={handleDeleteThumbnail}
        title="Remove Ticket Thumbnail"
        description="Are you sure you want to remove the ticket thumbnail? This action cannot be undone."
        confirmText="Yes, Remove"
        cancelText="Cancel"
        isLoading={false}
        variant="destructive"
      />
    </>
  );
}
