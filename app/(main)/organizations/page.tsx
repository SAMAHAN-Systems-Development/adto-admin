import {
	Organizations,
	columns,
} from "@/components/columns/organizations-column";
import {OrganizatonTable} from "@/components/tables/organizations-table";
import {Button} from "@/components/ui/button";
import {CirclePlusIcon} from "lucide-react";

async function getData(): Promise<Organizations[]> {
	//TODO: Replace with actual api data
	return [
		{
			name: "Samahan Systems and Development",
			acronym: "SYSDEV",
			email: "samahan.sd@addu.edu.ph",
			orgEvents: 2,
			color: "#0000FF",
		},
		{
			name: "Organization X",
			acronym: "ORGX",
			email: "orgx@gmail.com",
			orgEvents: 0,
			color: "#FF0000",
		},
		{
			name: "Organization Y",
			acronym: "hehe",
			email: "org-oops!@gmail.com",
			orgEvents: 0,
			color: "#00FF00",
		},
	];
}

export default async function OrganizationsPage() {
	const data = await getData();

	return (
		<div className="container w-full mt-14 ml-3">
			<h1 className="font-medium text-5xl ml-6">Organizations</h1>
			<div className="flex flex-row justify-end items-end mb-5">
				<Button
					className="bg-secondary "
					variant={"default"}
				>
					<CirclePlusIcon />
					Add Organization
					{/* Add Onclick event for organization creation */}
				</Button>
			</div>
			<OrganizatonTable
				columns={columns}
				data={data}
			/>
		</div>
	);
}
