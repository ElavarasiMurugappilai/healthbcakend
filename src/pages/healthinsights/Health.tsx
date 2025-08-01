import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-auto min-h-[35px] sm:min-h-[40px] md:min-h-[45px]">
          <TabsTrigger 
            value="today"
            className="py-1.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300"
          >
            Today vs Yesterday
          </TabsTrigger>
          <TabsTrigger 
            value="week"
            className="py-1.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300"
          >
            Last 7 Days
          </TabsTrigger>
          <TabsTrigger 
            value="month"
            className="py-1.5 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300"
          >
            Month
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2 ml-auto">
        <Label htmlFor="from-date" className="text-sm">From</Label>
        <Input 
          id="from-date"
          type="date" 
          value={dateRange.from} 
          onChange={e => setDateRange({ ...dateRange, from: e.target.value })} 
          className="h-8 w-32" 
        />
        <Label htmlFor="to-date" className="text-sm">To</Label>
        <Input 
          id="to-date"
          type="date" 
          value={dateRange.to} 
          onChange={e => setDateRange({ ...dateRange, to: e.target.value })} 
          className="h-8 w-32" 
        />
      </div>
    </div>
  </div>
);

export default Health; 