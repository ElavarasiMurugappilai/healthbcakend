import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";

interface BloodProps {
  glucoseData: any[];
  barSize: number;
}

const Blood: React.FC<BloodProps> = ({ glucoseData, barSize }) => {
  const chartConfig = {
    today: {
      label: "Today",
      color: "#ff5722",
    },
    yesterday: {
      label: "Yesterday", 
      color: "#b0c4de",
    },
  };

  return (
  <Card className="h-80 flex flex-col w-full min-w-0 px-0 py-0 shadow-xl hover:-translate-y-1 transition-all duration-200 bg-card border border-border">
      <CardHeader className="pb-2 pt-1">
        <CardTitle className="mt-4">Blood Glucose</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-stretch w-full min-w-0 h-full p-0 m-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={glucoseData} barSize={barSize} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip />
            <ChartLegend />
            <Bar dataKey="today" fill="#ff5722" name="Today" barSize={barSize} />
            <Bar dataKey="yesterday" fill="#b0c4de" name="Yesterday" barSize={barSize} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Blood; 