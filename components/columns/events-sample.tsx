// Mock data
export const data: AteneoEvent[] = [
	{
		id: "1",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "2",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Close",
		status: "Pending",
		events: 10,
	},
	{
		id: "3",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Close",
		status: "Rejected",
		events: 10,
	},
	{
		id: "4",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "5",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "6",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "7",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "8",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "9",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "10",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
	{
		id: "11",
		name: "SAMAHAN SYSDEV General Assembly",
		date: "Jan 16, 2025",
		registration: "Open",
		status: "Approved",
		events: 10,
	},
];

export type AteneoEvent = {
	id: string;
	name: string;
	date: string;
	registration: string;
	status: "Rejected" | "Pending" | "Approved";
	events: number;
};
