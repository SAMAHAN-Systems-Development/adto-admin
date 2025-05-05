"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import {CheckIcon} from "@radix-ui/react-icons";
import {cn} from "@/lib/utils";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
		indeterminate?: boolean;
	}
>(({className, indeterminate, ...props}, ref) => {
	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(
				"peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow",
				"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
				className
			)}
			data-state={indeterminate ? "indeterminate" : undefined}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				className={cn("flex items-center justify-center text-current")}
			>
				{indeterminate ? (
					<div className="h-0.5 w-3 bg-current" />
				) : (
					<CheckIcon className="h-4 w-4" />
				)}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export {Checkbox};
