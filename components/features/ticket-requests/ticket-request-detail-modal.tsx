"use client";

import { useState } from "react";
import { XIcon, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TicketRequestItem } from "@/lib/types/requests/TicketRequestRequests";
import {
  useApproveTicketRequestMutation,
  useDeclineTicketRequestMutation,
  useRevertTicketRequestMutation,
} from "@/lib/api/mutations/ticketRequestMutation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Download } from "lucide-react";

interface TicketRequestDetailModalProps {
  request: TicketRequestItem;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketRequestDetailModal({
  request,
  isOpen,
  onClose,
}: TicketRequestDetailModalProps) {
  const [ticketLink, setTicketLink] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [activeAction, setActiveAction] = useState<"approve" | "decline" | "revert" | null>(null);

  const approveMutation = useApproveTicketRequestMutation();
  const declineMutation = useDeclineTicketRequestMutation();
  const revertMutation = useRevertTicketRequestMutation();

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!ticketLink.trim()) {
      toast.error("Please provide a ticket URL");
      return;
    }

    try {
      await approveMutation.mutateAsync({
        id: request.id,
        ticketLink: ticketLink.trim(),
      });
      toast.success("Ticket request approved!", {
        duration: 3000,
        position: "bottom-right",
      });
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to approve";
      toast.error(msg);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a decline reason");
      return;
    }

    try {
      await declineMutation.mutateAsync({
        id: request.id,
        declineReason: declineReason.trim(),
      });
      toast.success("Ticket request declined.", {
        duration: 3000,
        position: "bottom-right",
      });
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to decline";
      toast.error(msg);
    }
  };

  const handleRevert = async () => {
    try {
      await revertMutation.mutateAsync(request.id);
      toast.success("Request reverted to pending", {
        duration: 3000,
        position: "bottom-right",
      });
      setActiveAction(null);
      onClose();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to revert";
      toast.error(msg);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename || "thumbnail.png";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download image");
      console.error(error);
    }
  };

  const isPending = request.status === "PENDING";

  const statusBadge = () => {
    if (request.status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
          <Clock className="w-4 h-4" /> Pending
        </span>
      );
    }
    if (request.status === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          <CheckCircle2 className="w-4 h-4" /> Approved
        </span>
      );
    }
    if (request.status === "DECLINED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          <XCircle className="w-4 h-4" /> Declined
        </span>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Ticket Request</h2>
            {statusBadge()}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Organization Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            Requested by
          </h3>
          <div className="flex items-center gap-3">
            {request.org.icon && (
              <Image
                src={request.org.icon}
                alt={request.org.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{request.org.name}</p>
              {request.org.acronym && (
                <p className="text-sm text-gray-500">{request.org.acronym}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">
            Ticket Details
          </h3>
          <div className="border rounded-lg p-4">
            {request.ticket.thumbnail ? (
              <div className="mb-4 text-center">
                <div className="rounded-lg overflow-hidden max-h-48 relative inline-block group">
                  <Image
                    src={request.ticket.thumbnail}
                    alt={request.ticket.name}
                    width={600}
                    height={192}
                    className="object-cover max-h-48"
                  />
                </div>
                <div className="mt-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => downloadImage(request.ticket.thumbnail!, `${request.ticket.name}-thumbnail`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center py-10 px-4 text-center">
                <p className="text-sm font-medium text-gray-900 mb-1">No Thumbnail Attached</p>
                <p className="text-xs text-gray-500">The organization did not upload an image for this ticket.</p>
              </div>
            )}
            <h4 className="text-lg font-semibold text-blue-700 mb-2">
              {request.ticket.name}
            </h4>
            <span className="text-gray-500 block text-xs font-semibold uppercase tracking-wide mb-1">Description</span>
            <p className="text-sm text-gray-600 mb-4">
              {request.ticket.description}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
              <div>
                <span className="text-gray-500 block">Event</span>
                <span className="font-medium">{request.ticket.event.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Price</span>
                <span className="font-medium">₱ {request.ticket.price}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Capacity</span>
                <span className="font-medium">{request.ticket.capacity} Pax</span>
              </div>
              <div>
                <span className="text-gray-500 block">Registration Deadline</span>
                <span className="font-medium">
                  {request.ticket.registrationDeadline 
                    ? new Date(request.ticket.registrationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
                    : "None"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Approved: Show link */}
        {request.status === "APPROVED" && request.ticketLink && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-semibold text-green-700 mb-2">
              Approved Ticket Link
            </h3>
            <a
              href={request.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
            >
              {request.ticketLink}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Declined: Show reason */}
        {request.status === "DECLINED" && request.declineReason && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-700 mb-2">
              Decline Reason
            </h3>
            <p className="text-sm text-red-600">{request.declineReason}</p>
          </div>
        )}

        {/* Action Buttons — only for pending requests */}
        {isPending && (
          <div className="border-t pt-6 space-y-4">
            {/* Approve Section */}
            {activeAction !== "decline" && (
              <div>
                {activeAction === "approve" ? (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Ticket URL
                    </label>
                    <Input
                      value={ticketLink}
                      onChange={(e) => setTicketLink(e.target.value)}
                      placeholder="https://example.com/ticket-link"
                      className="w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveAction(null);
                          setTicketLink("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={approveMutation.isPending || !ticketLink.trim()}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {approveMutation.isPending ? "Approving..." : "Approve Request"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveAction("approve")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve with Ticket URL
                  </Button>
                )}
              </div>
            )}

            {/* Decline Section */}
            {activeAction !== "approve" && (
              <div>
                {activeAction === "decline" ? (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Decline Reason
                    </label>
                    <Textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Provide a reason for declining this request..."
                      className="w-full min-h-[100px] resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveAction(null);
                          setDeclineReason("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDecline}
                        disabled={declineMutation.isPending || !declineReason.trim()}
                        variant="destructive"
                      >
                        {declineMutation.isPending ? "Declining..." : "Decline Request"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveAction("decline")}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline Request
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Revert Action — for approved/declined requests */}
        {!isPending && (
          <div className="border-t pt-6 mt-6">
            {activeAction === "revert" ? (
              <div className="space-y-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-semibold text-orange-800">
                  Are you sure you want to revert this decision?
                </p>
                <p className="text-xs text-orange-700">
                  This will change the request status back to Pending and remove the provided ticket URL or decline reason. The organization will see this request as pending again.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => setActiveAction(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRevert}
                    disabled={revertMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {revertMutation.isPending ? "Reverting..." : "Yes, Revert to Pending"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setActiveAction("revert")}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Change Decision (Revert to Pending)
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
