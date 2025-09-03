import React, { useState, useEffect } from "react";
import Health from "./healthinsights/Health";
import Blood from "./healthinsights/Blood";
import HeartRate from "./healthinsights/HeartRate";
import Sleep from "./healthinsights/Sleep";
import Steps from "./healthinsights/Steps";
import AI from "./healthinsights/AI";
import { motion } from "framer-motion";
import API from "@/api";

interface HealthInsightsPageProps {
  searchValue: string;
}

const HealthInsightsPage: React.FC<HealthInsightsPageProps> = ({ searchValue }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [compare, setCompare] = useState("today");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for health data
  const [glucoseData, setGlucoseData] = useState<any[]>([]);
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [stepsData, setStepsData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to format chart data
  const formatChartData = (dailyData: any[], type: string) => {
    if (!dailyData || dailyData.length === 0) return [];

    return dailyData.map((item, index) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      switch (type) {
        case 'glucose':
          return {
            time: index + 8, // Start from 8 AM
            today: item.avgValue || 0,
            yesterday: (item.avgValue || 0) - Math.random() * 20 + 10
          };
        case 'heartRate':
          return {
            label: dayName,
            avg: Math.round(item.avgValue || 0)
          };
        case 'sleep':
          return {
            label: dayName,
            hours: parseFloat((item.avgValue || 0).toFixed(1))
          };
        case 'steps':
          return {
            label: dayName,
            steps: Math.round(item.avgValue || 0)
          };
        default:
          return item;
      }
    });
  };

  // Fetch health insights data from API
  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all health data in parallel
      const [vitalsRes, wellnessRes, insightsRes] = await Promise.all([
        API.get('/health-insights/vitals'),
        API.get('/health-insights/wellness'),
        API.get('/health-insights/insights')
      ]);

      // Process vitals data
      const vitalsData = vitalsRes.data.data || [];
      const wellnessData = wellnessRes.data.data || [];
      const insightsData = insightsRes.data.data || {};

      // Transform vitals data for charts
      const glucoseMetric = vitalsData.find((v: any) => v.metric === 'blood_glucose');
      const heartRateMetric = vitalsData.find((v: any) => v.metric === 'heart_rate');
      
      // Transform wellness data for charts
      const sleepMetric = wellnessData.find((w: any) => w.metric === 'sleep_hours');
      const stepsMetric = wellnessData.find((w: any) => w.metric === 'steps');

      // Format data for chart components
      setGlucoseData(formatChartData(glucoseMetric?.dailyData || [], 'glucose'));
      setHeartRateData(formatChartData(heartRateMetric?.dailyData || [], 'heartRate'));
      setSleepData(formatChartData(sleepMetric?.dailyData || [], 'sleep'));
      setStepsData(formatChartData(stepsMetric?.dailyData || [], 'steps'));
      setAiInsights(insightsData.insights || []);

    } catch (err: unknown) {
      console.error('Failed to fetch health insights:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load health insights';
      setError(errorMessage);

      // Fallback to mock data on error
      setGlucoseData([
        { label: "6am", today: 90, yesterday: 85 },
        { label: "8am", today: 110, yesterday: 100 },
        { label: "10am", today: 130, yesterday: 120 },
        { label: "12pm", today: 150, yesterday: 140 },
        { label: "2pm", today: 120, yesterday: 110 },
        { label: "4pm", today: 100, yesterday: 95 },
        { label: "6pm", today: 105, yesterday: 100 },
      ]);
      setHeartRateData([
        { label: "Mon", avg: 76 },
        { label: "Tue", avg: 80 },
        { label: "Wed", avg: 78 },
        { label: "Thu", avg: 74 },
        { label: "Fri", avg: 82 },
        { label: "Sat", avg: 79 },
        { label: "Sun", avg: 77 },
      ]);
      setSleepData([
        { label: "Mon", hours: 7.2 },
        { label: "Tue", hours: 6.8 },
        { label: "Wed", hours: 8.1 },
        { label: "Thu", hours: 7.5 },
        { label: "Fri", hours: 7.9 },
        { label: "Sat", hours: 8.3 },
        { label: "Sun", hours: 7.7 },
      ]);
      setStepsData([
        { label: "Mon", steps: 6500 },
        { label: "Tue", steps: 7200 },
        { label: "Wed", steps: 8000 },
        { label: "Thu", steps: 9000 },
        { label: "Fri", steps: 7500 },
        { label: "Sat", steps: 10000 },
        { label: "Sun", steps: 8500 },
      ]);
      setAiInsights([
        "Your sugar spiked after lunch consistently this week.",
        "You sleep longer on weekends.",
        "Heart rate is slightly higher on Fridays.",
        "Step count peaked on Saturday!"
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load health data on component mount
  useEffect(() => {
    fetchHealthData();
  }, []);

  let barSize = 16;
  if (width < 500) barSize = 8;
  else if (width < 900) barSize = 12;
  const lineStroke = width < 600 ? 1 : width < 900 ? 2 : 3;

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

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading health insights...</div>
        </div>
      ) : (
        /* Graphs */
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
      )}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <AI aiInsights={filteredAIInsights} />
        </motion.div>
      )}
    </div>
  );
};

export default HealthInsightsPage;