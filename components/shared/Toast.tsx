"use client";

import toast from "react-hot-toast";

export function showCreateToast(newTicketId: number, setTickets: any) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-blue-600 shadow-lg rounded-lg pointer-events-auto flex items-center justify-between p-4`}
      >
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-white">
            Ticket created successfully
          </p>
          <p className="text-xs text-blue-100 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Undo button */}
        <button
          onClick={() => {
            setTickets((prev: any) =>
              prev.filter((ticket: any) => ticket.id !== newTicketId)
            );
            toast.dismiss(t.id);
          }}
          className="ml-4 px-4 py-1.5 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
        >
          Undo
        </button>
      </div>
    ),
    { duration: 3000, position: "bottom-right" }
  );
}

export function showUpdateToast(updatedTicket: any, onUndo: () => void) {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-blue-600 shadow-lg rounded-lg pointer-events-auto flex items-center justify-between p-4`}
      >
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-white">
            Ticket details has been successfully updated
          </p>
          <p className="text-xs text-blue-100 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Undo button */}
        <button
          onClick={() => {
            onUndo();
            toast.dismiss(t.id);
          }}
          className="ml-4 px-4 py-1.5 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
        >
          Undo
        </button>
      </div>
    ),
    { duration: 3000, position: "bottom-right" }
  );
}
