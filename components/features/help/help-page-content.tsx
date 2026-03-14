"use client";

import { BookOpenText, CircleHelp, ListChecks, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/lib/types/user-type";
import {
  gettingStartedItems,
  helpFaqs,
  helpGuides,
  isRoleAllowed,
} from "./help-content";

interface HelpPageContentProps {
  role: UserType;
}

export default function HelpPageContent({ role }: HelpPageContentProps) {
  const filteredGuides = helpGuides.filter((guide) => isRoleAllowed(guide.allowedRoles, role));
  const filteredFaqs = helpFaqs.filter((faq) => isRoleAllowed(faq.allowedRoles, role));
  const filteredGettingStarted = gettingStartedItems.filter((item) =>
    isRoleAllowed(item.allowedRoles, role),
  );

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-gray-900">Help &amp; Support</h1>
          <Badge variant="secondary" className="text-sm">
            {role === UserType.ADMIN ? "Superadmin View" : "Admin / Organization View"}
          </Badge>
        </div>
        <p className="text-gray-600 max-w-4xl">
          Learn how to use the ADTO Event Booking and Management System with guides tailored to
          your role.
        </p>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpenText className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Getting Started</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGettingStarted.map((item) => (
            <Card key={item.id} className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Feature Guides</h2>
        </div>

        <div className="space-y-4">
          {filteredGuides.map((guide) => (
            <Card key={guide.id} className="border-gray-200">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  {guide.allowedRoles?.length ? (
                    <Badge variant="outline" className="text-xs">
                      {guide.allowedRoles.includes(UserType.ADMIN)
                        ? "Superadmin"
                        : "Admin / Organization"}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Shared
                    </Badge>
                  )}
                </div>
                <CardDescription>{guide.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What it does</h3>
                  <p className="text-sm text-gray-700">{guide.whatItDoes}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                    {guide.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">Important notes</h3>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    {guide.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <CircleHelp className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>

        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-base text-gray-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
