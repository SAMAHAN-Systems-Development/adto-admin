"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import type { Event } from "@/lib/types/entities";

interface ViewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEdit?: () => void;
}

export function ViewEventModal({ isOpen, onClose, event, onEdit }: ViewEventModalProps) {
  if (!event) return null;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold text-blue-600 pr-8">
              {event.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Meta Information */}
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm">
                {formatDate(event.dateStart)} | {formatTime(event.dateStart)}
              </span>
            </div>
            {event.org && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-sm">{event.org.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* Event Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Start Date & Time</h4>
              <p className="text-gray-700">
                {formatDate(event.dateStart)} at {formatTime(event.dateStart)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">End Date & Time</h4>
              <p className="text-gray-700">
                {formatDate(event.dateEnd)} at {formatTime(event.dateEnd)}
              </p>
            </div>
          </div>

          {/* Event Status Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${event.isPublished ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Published</span>
                </div>
                <span className={`text-sm font-semibold ${event.isPublished ? 'text-blue-600' : 'text-gray-500'}`}>
                  {event.isPublished ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${event.isArchived ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Archived</span>
                </div>
                <span className={`text-sm font-semibold ${event.isArchived ? 'text-blue-600' : 'text-gray-500'}`}>
                  {event.isArchived ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${event.isRegistrationOpen ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Registration Open</span>
                </div>
                <span className={`text-sm font-semibold ${event.isRegistrationOpen ? 'text-blue-600' : 'text-gray-500'}`}>
                  {event.isRegistrationOpen ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${event.isRegistrationRequired ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Registration Required</span>
                </div>
                <span className={`text-sm font-semibold ${event.isRegistrationRequired ? 'text-blue-600' : 'text-gray-500'}`}>
                  {event.isRegistrationRequired ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${event.isOpenToOutsiders ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Open to Outsiders</span>
                </div>
                <span className={`text-sm font-semibold ${event.isOpenToOutsiders ? 'text-blue-600' : 'text-gray-500'}`}>
                  {event.isOpenToOutsiders ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Categories */}
          {event.ticketCategories && event.ticketCategories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Categories</h3>
              <div className="space-y-2">
                {event.ticketCategories.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{ticket.name}</p>
                      <p className="text-sm text-gray-600">{ticket.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₱{ticket.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Capacity: {ticket.capacity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registrations Count */}
          {event.registrations && event.registrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registrations</h3>
              <p className="text-gray-700">
                Total Registrations: <span className="font-semibold">{event.registrations.length}</span>
              </p>
            </div>
          )}

          {/* Form Questions */}
          {event.formQuestions && event.formQuestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Questions</h3>
              <div className="space-y-2">
                {event.formQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Type: {question.formElementId}
                    </p>
                    {question.formQuestionChoices && question.formQuestionChoices.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Choices:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                          {question.formQuestionChoices.map((choice) => (
                            <li key={choice.id}>{choice.choice}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
          {onEdit && (
            <Button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Edit Event
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
