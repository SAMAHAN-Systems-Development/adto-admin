"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, Trash2, ExternalLink } from "lucide-react";
import { useUploadConceptPaperMutation, useDeleteConceptPaperMutation } from "@/lib/api/mutations/eventsMutations";
import { useEventRequestsQuery } from "@/lib/api/queries/eventRequestQueries";
import { useCreateEventRequestMutation } from "@/lib/api/mutations/eventRequestMutation";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConceptPaperUploadTabProps {
  event: {
    id: string;
    conceptPaperUrl: string | null;
  };
}

export function ConceptPaperUploadTab({ event }: ConceptPaperUploadTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const uploadMutation = useUploadConceptPaperMutation();
  const deleteMutation = useDeleteConceptPaperMutation();
  const { user } = useAuthStore();
  
  const { data: requestsData, isLoading: requestsLoading } = useEventRequestsQuery({ eventId: event.id, limit: 1 });
  const eventRequest = requestsData?.data?.[0];
  
  const createRequestMutation = useCreateEventRequestMutation();

  const canUpload = user?.role === "ORGANIZATION" || user?.role === "ADMIN";

  const handleSubmitRequest = async () => {
    try {
      if (!event.conceptPaperUrl) {
         toast.error("Please upload a concept paper first.");
         return;
      }
      await createRequestMutation.mutateAsync(event.id);
      toast.success("Event request submitted successfully!");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to submit request.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setValidationError("Only PDF files are allowed.");
        e.target.value = "";
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setValidationError("File size must be less than 15MB.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await uploadMutation.mutateAsync({ id: event.id, file: selectedFile });
    setSelectedFile(null);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(event.id);
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Concept Paper</h3>
          <p className="text-sm text-gray-600">
            Upload the concept paper (PDF, max 15MB) for this event.
          </p>
        </div>
      </div>

      {event.conceptPaperUrl ? (
        <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
          <FileText className="h-12 w-12 text-blue-600 mb-4" />
          <p className="text-gray-900 font-medium mb-2">Concept Paper Uploaded</p>
          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => {
                if (event.conceptPaperUrl) {
                  window.open(event.conceptPaperUrl, "_blank");
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
              View / Download
            </Button>
            
            {canUpload && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="h-4 w-4" />
                  Replace
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-8 w-full border-t border-gray-200 pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Event Approval Status</h4>
            {requestsLoading ? (
              <p className="text-sm text-gray-500">Loading status...</p>
            ) : eventRequest ? (
              <div className={`p-4 rounded-lg flex items-center justify-between border ${
                eventRequest.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                eventRequest.status === 'DENIED' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div>
                  <p className={`font-semibold flex items-center gap-2 ${
                    eventRequest.status === 'APPROVED' ? 'text-green-800' :
                    eventRequest.status === 'DENIED' ? 'text-red-800' :
                    'text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      eventRequest.status === 'APPROVED' ? 'bg-green-500' :
                      eventRequest.status === 'DENIED' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}></span>
                    Status: {eventRequest.status}
                  </p>
                  {eventRequest.status === 'DENIED' && eventRequest.remark && (
                    <div className="mt-2 text-sm text-red-600 bg-white bg-opacity-50 p-2 rounded-md border border-red-100">
                      <span className="font-semibold block mb-1">Reason for Denial:</span>
                      {eventRequest.remark}
                    </div>
                  )}
                  {eventRequest.status === 'APPROVED' && (
                    <p className="mt-1 text-sm text-green-700">This event has been approved by the Superadmin and can now be published.</p>
                  )}
                  {eventRequest.status === 'PENDING' && (
                    <p className="mt-1 text-sm text-yellow-700">Waiting for Superadmin approval.</p>
                  )}
                </div>
                {eventRequest.status === 'DENIED' && canUpload && (
                   <Button
                      onClick={handleSubmitRequest}
                      disabled={createRequestMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white shrink-0 ml-4 shadow-sm"
                    >
                      {createRequestMutation.isPending ? "Submitting..." : "Submit Again"}
                   </Button>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <p className="text-sm text-gray-600">You must submit this event for approval before it can be published.</p>
                {canUpload && (
                   <Button
                      onClick={handleSubmitRequest}
                      disabled={createRequestMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 ml-4"
                    >
                      {createRequestMutation.isPending ? "Submitting..." : "Submit for Approval"}
                   </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          {selectedFile ? (
            <div className="text-center">
              <p className="text-gray-900 font-medium mb-2">{selectedFile.name}</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload File"}
                </Button>
              </div>
            </div>
          ) : (
             <div className="text-center">
               <p className="text-gray-600 mb-4">No concept paper uploaded yet.</p>
               {canUpload && (
                 <div className="flex justify-center">
                   <Button
                     onClick={() => fileInputRef.current?.click()}
                     className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                   >
                     <UploadCloud className="h-4 w-4" />
                     Select PDF File
                   </Button>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Concept Paper"
        description="Are you sure you want to delete this concept paper? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />

      <AlertDialog
        open={Boolean(validationError)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setValidationError(null);
        }}
      >
        <AlertDialogContent className="bg-white sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 text-xl font-semibold">Invalid File</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base pt-2">
              {validationError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setValidationError(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
