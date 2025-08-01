import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HeartRateProps {
  heartRateData: any[];
  lineStroke: number;
}

const HeartRate: React.FC<HeartRateProps> = ({ heartRateData, lineStroke }) => (
  <Card className="h-80 flex flex-col w-full min-w-0 shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
    <CardHeader>
      <CardTitle>Heart Rate</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex items-center w-full min-w-0 dark:bg-gradient-to-r from-gray-800 to-zinc-800">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={heartRateData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avg" stroke="#4f8cff" name="Avg BPM" strokeWidth={lineStroke} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default HeartRate; 