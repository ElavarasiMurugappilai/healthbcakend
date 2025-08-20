import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface StepsProps {
  stepsData: any[];
  barSize: number;
}

const Steps: React.FC<StepsProps> = ({ stepsData, barSize }) => {
  const chartConfig = {
    steps: {
      label: "Steps",
      color: "#22c55e",
    },
  };

  return (
  <Card className="h-80 flex flex-col w-full min-w-0 shadow-xs hover:-translate-y-1 transition-all duration-200 bg-card border border-border">
      <CardHeader>
        <CardTitle>Steps</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center w-full min-w-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={stepsData} barSize={barSize}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="steps" fill="#22c55e" name="Steps" barSize={barSize} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Steps; 