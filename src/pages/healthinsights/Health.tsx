import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthHeaderProps {
  compare: string;
  setCompare: (val: string) => void;
  dateRange: { from: string; to: string };
  setDateRange: (range: { from: string; to: string }) => void;
}

const Health: React.FC<HealthHeaderProps> = ({ compare, setCompare, dateRange, setDateRange }) => (
  <div className="mb-2">
    <h1 className="text-2xl font-bold mb-2 ">Health Insights</h1>
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full max-w-full min-w-0 overflow-x-hidden">
      <Tabs value={compare} onValueChange={setCompare} className="w-full md:w-auto">
        <TabsList>
          <TabsTrigger value="today">Today vs Yesterday</TabsTrigger>
          <TabsTrigger value="week">Last 7 Days</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-sm">From</span>
        <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="h-8 w-32 border rounded px-2" />
        <span className="text-sm">To</span>
        <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="h-8 w-32 border rounded px-2" />
      </div>
    </div>
  </div>
);

export default Health; 