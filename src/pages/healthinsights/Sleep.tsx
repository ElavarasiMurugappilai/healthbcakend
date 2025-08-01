import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SleepProps {
  sleepData: any[];
  lineStroke: number;
}

const Sleep: React.FC<SleepProps> = ({ sleepData, lineStroke }) => (
  <Card className="h-80 flex flex-col w-full min-w-0 w-full h-80 px-2 shadow-xs hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
    <CardHeader>
      <CardTitle>Sleep</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex items-center w-full min-w-0">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={sleepData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#7c3aed" name="Hours" strokeWidth={lineStroke} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default Sleep; 