import type { SectionCardProps } from "@/types/onboardingProps.types";
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
}: SectionCardProps) {
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
