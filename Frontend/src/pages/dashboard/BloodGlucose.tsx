import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Icons } from "@/components/ui/icons";

// Shadcn-styled bar shape with cloud icon for selected bars
const ShadcnBar = (props: any) => {
  const { x, y, width, height, payload, fill } = props;
  const barRadius = width / 2; // fully rounded
  
  // Responsive cloud size: smaller on small screens
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const isMediumScreen = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
  
  // More granular responsive sizing
  const cloudRadius = isSmallScreen ? 8 : isMediumScreen ? 12 : 16;
  const cloudIconSize = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;
  const cloudYOffset = isSmallScreen ? 6 : isMediumScreen ? 10 : 14;
  const cloudY = y - 32;
  
  return (
    <g>
      {/* Main bar with rounded corners using shadcn styling */}
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        rx={barRadius} 
        fill={fill}
        className="transition-all duration-200 hover:opacity-80"
      />
      
      {/* Cloud icon overlay for specific time points */}
      {[10, 14, 18,].includes(payload.time) && (
        <g>
          {/* Cloud background circle */}
          <circle 
            cx={x + width / 2} 
            cy={cloudY + cloudYOffset} 
            r={cloudRadius} 
            fill="#e5e7eb" 
            className="dark:fill-gray-700"
          />
          
          {/* Cloud icon using shadcn Icons */}
          <foreignObject 
            x={x + width / 2 - cloudIconSize / 2} 
            y={cloudY + cloudYOffset - cloudIconSize / 2} 
            width={cloudIconSize} 
            height={cloudIconSize}
            className="text-blue-400 dark:text-blue-300"
          >
            <div className="flex items-center justify-center w-full h-full">
              <Icons.cloud size={cloudIconSize} />
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  );
};

interface BloodGlucoseProps {
  glucoseData: any[];
  barSize: number;
}

const BloodGlucose: React.FC<BloodGlucoseProps> = ({ glucoseData, barSize }) => {
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
    <div className="flex-1 min-w-0 mb-2 lg:mb-0">
      <Card className="w-full h-80 px-2 shadow-2xl hover:-translate-y-1 transition-all duration-200 bg-white text-black dark:bg-gradient-to-r from-gray-800 to-zinc-800 dark:text-white border border-gray-200 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Blood Glucose Trends</CardTitle>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Today</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-200 inline-block" /> Yesterday</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs font-bold text-foreground mb-2 ml-2">Mg/dL</div>
          <div className="h-56 flex items-center justify-center text-gray-400 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart
                data={glucoseData}
                barGap={8}
                barCategoryGap={30}
                barSize={barSize}
                margin={{ left: 0, right: 0, top: 32, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={[8, 20]}
                  ticks={[6.5,8, 10, 12, 14, 16, 18, 20]}
                  tick={{ fill: 'currentColor', fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 120]}
                  ticks={[0, 20, 60, 80, 100, 120]}
                  tick={{ fill: 'currentColor', fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip cursor={{ fill: '#f3f4f6', opacity: 0.5 }} />
                <Bar dataKey="today" fill="#ff5722" shape={<ShadcnBar fill="#ff5722" />} barSize={barSize} />
                <Bar dataKey="yesterday" fill="#b0c4de" shape={<ShadcnBar fill="#b0c4de" />} barSize={barSize} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodGlucose; 