import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface HeartRateProps {
  heartRateData: any[];
  lineStroke: number;
}

const HeartRate: React.FC<HeartRateProps> = ({ heartRateData, lineStroke }) => {
  const chartConfig = {
    avg: {
      label: "Avg BPM",
      color: "#4f8cff",
    },
  };

  return (
  <Card className="h-80 flex flex-col w-full min-w-0 shadow-xl hover:-translate-y-1 transition-all duration-200 bg-card border border-border">
      <CardHeader>
        <CardTitle>Heart Rate</CardTitle>
      </CardHeader>
  <CardContent className="flex-1 flex items-center w-full min-w-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart data={heartRateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <ChartTooltip />
            <Line type="monotone" dataKey="avg" stroke="#4f8cff" name="Avg BPM" strokeWidth={lineStroke} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HeartRate; 