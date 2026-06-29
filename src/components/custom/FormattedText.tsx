import { cn } from "@/lib/utils";

export function FormattedText({
  children,
  className,
  as: Tag = "p",
}: {
  children: string;
  className?: string;
  as?: "p" | "span";
}) {
  return (
    <Tag className={cn("whitespace-pre-line", className)}>{children}</Tag>
  );
}
