import { Bike, FileQuestion, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  icon?: "bike" | "search" | "question";
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const ICONS = { bike: Bike, search: Search, question: FileQuestion };

export function EmptyState({ icon = "bike", title, description, action }: Props) {
  const Icon = ICONS[icon];
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed bg-surface/40">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
