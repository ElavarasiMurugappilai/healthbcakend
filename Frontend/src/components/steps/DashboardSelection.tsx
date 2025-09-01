import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Dumbbell, Droplets, Users, Pill } from "lucide-react";
import clsx from "clsx";

const DASHBOARD_CARDS = [
  {
    key: "showFitness",
    label: "Fitness Goal",
    icon: <Dumbbell className="text-blue-500" size={32} />,
  },
  {
    key: "showGlucose",
    label: "Blood Glucose",
    icon: <Droplets className="text-orange-500" size={32} />,
  },
  {
    key: "showCareTeam",
    label: "My Care Team",
    icon: <Users className="text-purple-500" size={32} />,
  },
  {
    key: "showMedications",
    label: "Medications",
    icon: <Pill className="text-green-500" size={32} />,
  },
];

type DashboardSelectionStepProps = {
  formData: Record<string, boolean>;
  updateFormData: (key: string, value: boolean) => void;
};

export default function DashboardSelectionStep({ formData, updateFormData }: DashboardSelectionStepProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {DASHBOARD_CARDS.map((card) => {
        const selected = !!formData[card.key];
        return (
          <Card
            key={card.key}
            tabIndex={0}
            className={clsx(
              "cursor-pointer transition-all",
              selected
                ? "ring-2 ring-blue-500 border-blue-500"
                : "hover:ring-2 hover:ring-blue-300"
            )}
            onClick={() =>
              updateFormData(card.key, !selected)
            }
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                updateFormData(card.key, !selected);
              }
            }}
            aria-pressed={selected}
          >
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="mb-2">{card.icon}</div>
              <div className="font-semibold text-lg">{card.label}</div>
              {selected && (
                <CheckCircle2 className="mt-2 text-green-500" size={20} />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}