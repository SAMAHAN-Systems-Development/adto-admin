interface EventTabBadgeProps {
  count?: number;
}

export function EventTabBadge({ count }: EventTabBadgeProps) {
  if (!count || count === 0) return null;

  return (
    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-medium text-white bg-red-500 rounded-full">
      {count}
    </span>
  );
}
