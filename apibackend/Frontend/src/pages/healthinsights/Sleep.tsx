import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SleepProps {
  sleepData: any[];
  lineStroke: number;
}

const Sleep: React.FC<SleepProps> = ({ sleepData, lineStroke }) => {
  const chartConfig = {
    hours: {
      label: "Hours",
      color: "#7c3aed",
    },
  };

  return (
  <Card className="h-80 flex flex-col w-full min-w-0 w-full h-80 px-2 shadow-xs hover:-translate-y-1 transition-all duration-200 bg-card border border-border">
      <CardHeader>
        <CardTitle>Sleep</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center w-full min-w-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart data={sleepData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip />
            <Line type="monotone" dataKey="hours" stroke="#7c3aed" name="Hours" strokeWidth={lineStroke} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Sleep; 