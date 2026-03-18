"use client";

import { useState } from "react";
import { XIcon, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EventRequestItem } from "@/lib/types/requests/EventRequestRequests";
import {
  useApproveEventRequestMutation,
  useDeclineEventRequestMutation,
  useRevertEventRequestMutation,
} from "@/lib/api/mutations/eventRequestMutation";
import Image from "next/image";
import toast from "react-hot-toast";

interface EventRequestDetailModalProps {
  request: EventRequestItem;
  isOpen: boolean;
  onClose: () => void;
}

export function EventRequestDetailModal({
  request,
  isOpen,
  onClose,
}: EventRequestDetailModalProps) {
  const [declineReason, setDeclineReason] = useState("");
  const [activeAction, setActiveAction] = useState<"approve" | "decline" | "revert" | null>(null);

  const approveMutation = useApproveEventRequestMutation();
  const declineMutation = useDeclineEventRequestMutation();
  const revertMutation = useRevertEventRequestMutation();

  if (!isOpen) return null;

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(request.id);
      toast.success("Event request approved!", {
        duration: 3000,
        position: "bottom-right",
      });
      onClose();
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to approve");
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
      toast.success("Event request declined.", {
        duration: 3000,
        position: "bottom-right",
      });
      onClose();
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to decline");
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
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to revert");
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
    if (request.status === "DENIED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          <XCircle className="w-4 h-4" /> Denied
        </span>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Event Approval Request</h2>
            {statusBadge()}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
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

            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Event Name
              </h3>
              <p className="font-semibold text-lg text-gray-900">{request.event.name}</p>
            </div>

            {request.status === "DENIED" && request.remark && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-700 mb-1">
                  Decline Reason
                </h3>
                <p className="text-sm text-red-600">{request.remark}</p>
              </div>
            )}

            {isPending && (
              <div className="border-t pt-4 space-y-4">
                {activeAction !== "decline" && (
                  <div>
                    {activeAction === "approve" ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-900">Approve this event concept paper?</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setActiveAction(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleApprove}
                            disabled={approveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          >
                            {approveMutation.isPending ? "Approving..." : "Yes, Approve"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setActiveAction("approve")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve Concept Paper
                      </Button>
                    )}
                  </div>
                )}

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
                          placeholder="Provide a reason for declining..."
                          className="w-full min-h-[100px] resize-none"
                        />
                        <div className="flex gap-2">
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
                            className="flex-1"
                          >
                            {declineMutation.isPending ? "Declining..." : "Decline"}
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
                        Decline Concept Paper
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isPending && (
              <div className="border-t pt-4 mt-4">
                {activeAction === "revert" ? (
                  <div className="space-y-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm font-semibold text-orange-800">
                      Revert this decision?
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
                        {revertMutation.isPending ? "Reverting..." : "Revert"}
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
                    Change Decision (Revert)
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Concept Paper
            </h3>
            {request.event.conceptPaperUrl ? (
              <div className="w-full h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  src={`${request.event.conceptPaperUrl}#toolbar=0`}
                  className="w-full h-full"
                  title="Concept Paper PDF"
                />
              </div>
            ) : (
               <div className="w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center">
                 <p className="text-gray-500">No concept paper found.</p>
               </div>
            )}
            {request.event.conceptPaperUrl && (
              <div className="mt-4 flex justify-end">
                 <Button
                  variant="outline"
                  onClick={() => window.open(request.event.conceptPaperUrl!, '_blank')}
                  className="flex items-center gap-2 text-blue-600 border-blue-200"
                 >
                   <ExternalLink className="w-4 h-4" /> Open PDF in new tab
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
