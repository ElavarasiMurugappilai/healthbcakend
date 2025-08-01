import React, { useState } from "react";
import Health from "./healthinsights/Health";
import Blood from "./healthinsights/Blood";
import HeartRate from "./healthinsights/HeartRate";
import Sleep from "./healthinsights/Sleep";
import Steps from "./healthinsights/Steps";
import AI from "./healthinsights/AI";
import { motion } from "framer-motion";

// Responsive window width hook
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

interface HealthInsightsPageProps {
  searchValue: string;
}

const HealthInsightsPage: React.FC<HealthInsightsPageProps> = ({ searchValue }) => {
  const width = useWindowWidth();
  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;
  const lineStroke = width < 600 ? 1 : width < 900 ? 2 : 3;
  const [compare, setCompare] = useState("today");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const glucoseData = [
    { label: "6am", today: 90, yesterday: 85 },
    { label: "8am", today: 110, yesterday: 100 },
    { label: "10am", today: 130, yesterday: 120 },
    { label: "12pm", today: 150, yesterday: 140 },
    { label: "2pm", today: 120, yesterday: 110 },
    { label: "4pm", today: 100, yesterday: 95 },
    { label: "6pm", today: 105, yesterday: 100 },
  ];
  const heartRateData = [
    { label: "Mon", avg: 76 },
    { label: "Tue", avg: 80 },
    { label: "Wed", avg: 78 },
    { label: "Thu", avg: 74 },
    { label: "Fri", avg: 82 },
    { label: "Sat", avg: 79 },
    { label: "Sun", avg: 77 },
  ];
  const sleepData = [
    { label: "Mon", hours: 7.2 },
    { label: "Tue", hours: 6.8 },
    { label: "Wed", hours: 8.1 },
    { label: "Thu", hours: 7.5 },
    { label: "Fri", hours: 7.9 },
    { label: "Sat", hours: 8.3 },
    { label: "Sun", hours: 7.7 },
  ];
  const stepsData = [
    { label: "Mon", steps: 6500 },
    { label: "Tue", steps: 7200 },
    { label: "Wed", steps: 8000 },
    { label: "Thu", steps: 9000 },
    { label: "Fri", steps: 7500 },
    { label: "Sat", steps: 10000 },
    { label: "Sun", steps: 8500 },
  ];
  const aiInsights = [
    "Your sugar spiked after lunch consistently this week.",
    "You sleep longer on weekends.",
    "Heart rate is slightly higher on Fridays.",
    "Step count peaked on Saturday!"
  ];

  // Props: searchValue
  const insightCards = [
    { key: "blood", label: "Blood Glucose" },
    { key: "heart", label: "Heart Rate" },
    { key: "sleep", label: "Sleep" },
    { key: "steps", label: "Steps" }
  ];

  const filteredInsightCards = insightCards.filter(card =>
    card.label.toLowerCase().includes(searchValue.toLowerCase())
  );
  
  const filteredAIInsights = aiInsights.filter(insight =>
    insight.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto w-full max-w-full min-w-0 overflow-x-hidden">
      <Health compare={compare} setCompare={setCompare} dateRange={dateRange} setDateRange={setDateRange} />
      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-full min-w-0 overflow-x-hidden">
        {filteredInsightCards.some(card => card.key === "blood") && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Blood glucoseData={glucoseData} barSize={barSize} />
        </motion.div>
        )}
        {filteredInsightCards.some(card => card.key === "heart") && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <HeartRate heartRateData={heartRateData} lineStroke={lineStroke} />
        </motion.div>
        )}
        {filteredInsightCards.some(card => card.key === "sleep") && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Sleep sleepData={sleepData} lineStroke={lineStroke} />
        </motion.div>
        )}
        {filteredInsightCards.some(card => card.key === "steps") && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Steps stepsData={stepsData} barSize={barSize} />
        </motion.div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <AI aiInsights={filteredAIInsights} />
      </motion.div>
    </div>
  );
};

export default HealthInsightsPage; 