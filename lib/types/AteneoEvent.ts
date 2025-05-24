export type AteneoEvent = {
	id: string;
	name: string;
	date: string;
	registration: string;
	status: "Rejected" | "Pending" | "Approved";
	events: number;
};

