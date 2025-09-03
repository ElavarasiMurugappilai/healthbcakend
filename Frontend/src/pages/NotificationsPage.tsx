  import React, { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Card, CardContent } from "@/components/ui/card";
  import {
    Bell,
    BellOff,
    Pill,
    CalendarDays,
    Trophy,
    Settings2
  } from "lucide-react";
  // Framer Motion removed - using CSS animations instead

  interface NotificationsPageProps {
    searchValue: string;
  }

  const typeColors: Record<string, string> = {
    Medication: "border-l-4 border-primary",
    Appointments: "border-l-4 border-success",
    Challenge: "border-l-4 border-warning",
    System: "border-l-4 border-muted"
  };
  const urgentTypes = ["Missed Dose"];

  const shakeAnim = {
    initial: { x: 0 },
    animate: { x: [0, -8, 8, -8, 8, 0] },
    transition: { duration: 0.5, repeat: 1 }
  };

  const NotificationsPage: React.FC<NotificationsPageProps> = ({ searchValue }) => {
    type NotificationType = "Medication" | "Appointments" | "Challenge" | "System";
    type Notification = {
      id: number;
      type: NotificationType;
      title: string;
      desc: string;
      read: boolean;
      time: string;
    };
    
    const [notifications, setNotifications] = useState<Notification[]>([
      { id: 1, type: "Medication", title: "Take Metformin", desc: "It's time to take your 8am dose.", read: false, time: "08:00" },
      { id: 2, type: "Appointments", title: "Upcoming Appointment", desc: "You have an appointment with Dr. Smith tomorrow at 10:00.", read: false, time: "Yesterday" },
      { id: 3, type: "Challenge", title: "Daily Steps Challenge", desc: "You are 500 steps away from your daily goal!", read: true, time: "Today" },
      { id: 4, type: "System", title: "Profile Updated", desc: "Your profile was updated successfully.", read: true, time: "2 days ago" },
      { id: 5, type: "Medication", title: "Missed Dose", desc: "You missed your 8pm medication yesterday.", read: false, time: "Yesterday" },
      { id: 6, type: "Appointments", title: "Appointment Cancelled", desc: "Your appointment with Dr. Lee was cancelled.", read: true, time: "3 days ago" },
    ]);
    const [notifFilter, setNotifFilter] = useState<string>("All");
    const [toast, setToast] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    const playNotificationSound = () => {
      try {
        new Audio('/public/preview.mp3').play();
      } catch (e) {}
    };

    const filtered = notifications.filter(n =>
      (notifFilter === "All" || n.type === notifFilter) &&
      (
        n.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        n.desc.toLowerCase().includes(searchValue.toLowerCase()) ||
        n.type.toLowerCase().includes(searchValue.toLowerCase())
      )
    );

    const handleToggleRead = (id: number) => {
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, read: !n.read } : n);
        // Check if all are now read
        if (updated.every(n => n.read)) {
          // Add a sample notification
          const randomType = types[Math.floor(Math.random() * types.length)];
          const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
          const randomDesc = sampleDescs[Math.floor(Math.random() * sampleDescs.length)];
          setTimeout(() => {
            setNotifications(current => [
              {
                id: parseInt(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
                type: randomType,
                title: randomTitle,
                desc: randomDesc,
                read: false,
                time: "Just now"
              },
              ...current
            ]);
            setToast("New notification received!");
            playNotificationSound();
            setTimeout(() => setToast(""), 2000);
          }, 1000);
          setToast("All notifications marked as read!");
          setTimeout(() => setToast(""), 2000);
        }
        return updated;
      });
    };

    const sampleTitles = [
      "System Update",
      "Welcome to ARMED!",
      "Profile Changed",
      "Security Alert",
      "New Feature Released",
      "Backup Completed"
    ];
    const sampleDescs = [
      "Your system was updated successfully.",
      "Thank you for joining our platform!",
      "Your profile information has been changed.",
      "A new login was detected from a different device.",
      "Check out the latest features in your dashboard.",
      "Your data backup finished without issues."
    ];

    const handleMarkAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setToast("All notifications marked as read!");
      // Add a sample notification
      setTimeout(() => {
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
        const randomDesc = sampleDescs[Math.floor(Math.random() * sampleDescs.length)];
        setNotifications(prev => [
          {
            id: parseInt(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
            type: randomType,
            title: randomTitle,
            desc: randomDesc,
            read: false,
            time: "Just now"
          },
          ...prev
        ]);
        setToast("New notification received!");
        playNotificationSound();
        setTimeout(() => setToast(""), 2000);
      }, 1000);
      setTimeout(() => setToast(""), 2000);
    };

    const types: NotificationType[] = ["Medication", "Appointments", "Challenge", "System"];
    const typeIcons: { [key in NotificationType]: React.ReactNode } = {
    Medication: <Pill className="w-5 h-5 text-primary" />,
    Appointments: <CalendarDays className="w-5 h-5 text-success" />,
    Challenge: <Trophy className="w-5 h-5 text-warning" />,
    System: <Settings2 className="w-5 h-5 text-muted-foreground" />
    };

    // Add a details map for demonstration
    const detailsMap: Record<string, string> = {
      "Take Metformin": "Metformin helps control blood sugar levels. Please take your 8am dose with food as prescribed by your doctor. If you miss a dose, take it as soon as you remember.",
      "Upcoming Appointment": "You have an appointment with Dr. Smith tomorrow at 10:00. Please arrive 10 minutes early and bring your previous medical records.",
      "Daily Steps Challenge": "You are 500 steps away from your daily goal! Keep moving to reach your target and earn rewards.",
      "Profile Updated": "Your profile was updated successfully. Review your information to ensure everything is correct.",
      "Missed Dose": "You missed your 8pm medication yesterday. Missing doses can affect your treatment. Please consult your doctor if this happens frequently.",
      "Appointment Cancelled": "Your appointment with Dr. Lee was cancelled. Please reschedule at your convenience."
    };

    return (
  <div className="p-4 w-full max-w-6xl mx-auto space-y-6 overflow-x-hidden overflow-y-hidden min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">Notifications</h1>
          <Button onClick={handleMarkAllRead}>Mark all as read</Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-4 w-full">
          {["All", ...types].map(t => (
            <Button
              key={t}
              variant={notifFilter === t ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm transition-all duration-300 whitespace-nowrap animate-in fade-in duration-300 ${
                notifFilter === t
                  ? "shadow-[0_0_8px_2px_var(--theme-warning)] ring-2 ring-warning"
                  : ""
              }`}
              onClick={() => setNotifFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        
        {/* Notification List */}
        <Card className="w-full">
          <CardContent className="p-4">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">No notifications.</div>
            ) : (
              <ul className="space-y-4">
                {filtered.map(n => {
                  const isUrgent = n.title.toLowerCase().includes("missed");
                  return (
                  <li
                    key={n.id}
                    className={`flex w-full items-stretch justify-between py-4 gap-4 rounded-lg transition-all border border-border hover:border-primary/40 hover:shadow-md bg-card px-4 text-foreground animate-in fade-in slide-in-from-right-4 duration-300 ${typeColors[n.type]}`}
                    onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                    style={{ cursor: "pointer" }}
                  >
                      <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg flex-shrink-0">{typeIcons[n.type]}</span>
                          <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-muted" : "bg-warning"}`}></span>
                          <span className="font-semibold text-sm sm:text-base break-words text-left flex-1">{n.title}</span>
                        </div>
                        {expanded === n.id && (
                        <div
                          className="text-sm text-muted-foreground text-left animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                          {detailsMap[n.title] || n.desc}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{n.time}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-2 rounded-full hover:scale-110 transition-all duration-150 ${n.read ? "text-muted-foreground" : "text-warning"}`}
                        onClick={e => { e.stopPropagation(); handleToggleRead(n.id); }}
                        title={n.read ? "Mark as Unread" : "Mark as Read"}
                      >
                        {n.read ? <BellOff className="w-6 h-6" /> : <Bell className="w-6 h-6 text-warning" />}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
      
      {toast && (
        <div
          className="fixed bottom-6 right-6 bg-success text-success-foreground px-4 py-2 rounded shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-400"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

  export default NotificationsPage; 






  