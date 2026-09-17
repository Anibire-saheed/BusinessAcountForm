import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
export function SectionCard({
  title,
  description,
  children,
  contentClassName,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <Card className="mb-5 gap-5">
      <CardHeader>
        <CardTitle>
          <h3 className="text-[17px] text-primary">{title}</h3>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
