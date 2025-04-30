import {
	Organizations,
	columns,
} from "@/components/columns/organizations-column";
import {OrganizatonTable} from "@/components/tables/organizations-table";
import {Button} from "@/components/ui/button";

async function getData(): Promise<Organizations[]> {
	//TODO: Replace with actual api data
	return [
		{
			name: "Samahan Systems and Development",
			acronym: "SYSDEV",
			email: "samahan.sd@addu.edu.ph",
			orgEvents: 2,
			status: "Enabled",
		},
		{
			name: "Organization X",
			acronym: "ORGX",
			email: "orgx@gmail.com",
			orgEvents: 0,
			status: "Disabled",
		},
		{
			name: "Organization Y",
			acronym: "hehe",
			email: "org-oops!@gmail.com",
			orgEvents: 0,
			status: "Disabled",
		},
	];
}

export default async function OrganizationsPage() {
	const data = await getData();

	return (
		<div className="container mx-auto py-10 px-20">
			<div className="flex flex-row justify-end items-end mb-5">
				<Button
					className=""
					variant={"default"}
				>
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
