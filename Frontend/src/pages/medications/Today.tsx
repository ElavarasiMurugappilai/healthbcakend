import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface TodayProps {
  getTodayMedications: () => any[];
  handleTakeMedication: (medicationId: string, time: string) => void;
  handleSkipMedication: (medicationId: string, time: string) => void;
  handleMissedMedication: (medicationId: string, time: string) => void;
}

const Today: React.FC<TodayProps> = ({ getTodayMedications, handleTakeMedication, handleSkipMedication, handleMissedMedication }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-foreground">Today's Medications</h2>
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icons.pill className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Today</p>
            <p className="text-xl font-bold text-foreground">{getTodayMedications().length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icons.checkCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taken</p>
            <p className="text-xl font-bold text-primary">
              {getTodayMedications().filter(med => med.status === 'taken').length}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <Icons.xCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Missed</p>
            <p className="text-xl font-bold text-destructive">
              {getTodayMedications().filter(med => med.status === 'missed').length}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Icons.clock className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-xl font-bold text-accent">
              {getTodayMedications().filter(med => med.status === 'pending').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
    <div className="grid gap-4">
      {getTodayMedications().map((med, index) => (
        <Card key={`${med.id}-${med.time}`} className="p-4">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Icons.pill className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <h3 className="font-semibold text-foreground truncate text-left">{med.name}</h3>
                <div className="flex flex-row gap-2 text-sm text-muted-foreground text-left">
                  <span>{med.dosage}</span>
                  <span>•</span>
                  <span>{med.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate text-left">{med.instructions}</p>
              </div>
            </div>
            {med.status === 'pending' && (
              <div className="flex flex-row gap-2 min-w-[220px] justify-center">
                <Button
                  size="sm"
                  onClick={() => handleTakeMedication(med.id, med.time)}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  Take
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSkipMedication(med.id, med.time)}
                >
                  Skip
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMissedMedication(med.id, med.time)}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  Missed
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Today; 