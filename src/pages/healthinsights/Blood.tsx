import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface BloodProps {
  glucoseData: any[];
  barSize: number;
}

const Blood: React.FC<BloodProps> = ({ glucoseData, barSize }) => (
  <Card className="h-80 flex flex-col w-full min-w-0 px-0 py-0 shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 border border-gray-200 dark:border-zinc-800">
    <CardHeader className="pb-2 pt-1">
      <CardTitle className="mt-4">Blood Glucose</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 flex items-stretch w-full min-w-0 h-full p-0 m-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={glucoseData} barSize={barSize} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="today" fill="#ff5722" name="Today" barSize={barSize}  />
          <Bar dataKey="yesterday" fill="#b0c4de" name="Yesterday" barSize={barSize} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default Blood; 