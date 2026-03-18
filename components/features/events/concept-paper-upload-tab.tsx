"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, Trash2, ExternalLink } from "lucide-react";
import { useUploadConceptPaperMutation, useDeleteConceptPaperMutation } from "@/lib/api/mutations/eventsMutations";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useAuthStore } from "@/lib/store/authStore";

export function ConceptPaperUploadTab({ event }: { event: any }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const uploadMutation = useUploadConceptPaperMutation();
  const deleteMutation = useDeleteConceptPaperMutation();
  const { user } = useAuthStore();

  const canUpload = user?.role === "ORGANIZATION" || user?.role === "ADMIN";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert("File size must be less than 15MB.");
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
              onClick={() => window.open(event.conceptPaperUrl, '_blank')}
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
    </div>
  );
}
