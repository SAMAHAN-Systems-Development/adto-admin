"use client";

import {
  Organizations,
  getOrganizationColumns,
} from "@/components/features/organizations/organizations-column";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function getData(): Organizations[] {
  //TODO: Replace with actual api data
  return [
    {
      id: "1",
      name: "Samahan Systems and Development",
      acronym: "SYSDEV",
      email: "samahan.sd@addu.edu.ph",
      orgEvents: 2,
      icon: "#0000FF",
    },
    {
      id: "2",
      name: "Organization X",
      acronym: "ORGX",
      email: "orgx@gmail.com",
      orgEvents: 0,
      icon: "#FF0000",
    },
    {
      id: "3",
      name: "Organization Y",
      acronym: "hehe",
      email: "org-oops!@gmail.com",
      orgEvents: 0,
      icon: "#00FF00",
    },
  ];
}

export default function OrganizationsPage() {
  const router = useRouter();
  const data = getData();
  const columns = getOrganizationColumns(router);

  const handleCreateOrganization = () => {
    router.push("/organizations/create");
  };

  return (
    <div className="container w-full mt-14 ml-3">
      <h1 className="font-medium text-5xl ml-6">Organizations</h1>
      <div className="flex flex-row justify-end items-end mb-5 gap-2">
        <Button
          className="bg-secondary"
          variant={"default"}
          onClick={handleCreateOrganization}
        >
          <CirclePlusIcon />
          Add Organization
        </Button>
      </div>

      <div className="rounded-2xl border border-secondary w-full overflow-hidden [&_tr]:border-secondary [&_tr]:text-center">
        <DataTable enableSorting={true} columns={columns} data={data} />
      </div>
    </div>
  );
}
