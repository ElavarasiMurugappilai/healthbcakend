  import React, { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";

  interface NotificationsPageProps {
    searchValue: string;
  }

  const typeColors: Record<string, string> = {
    Medication: "border-l-4 border-blue-400",
    Appointments: "border-l-4 border-green-400",
    Challenge: "border-l-4 border-orange-400",
    System: "border-l-4 border-gray-400"
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
                id: Date.now(),
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
            id: Date.now(),
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
    const typeIcons: { [key in NotificationType]: string } = {
      Medication: "💊",
      Appointments: "📅",
      Challenge: "🏃",
      System: "⚙️"
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
          <h1 className="text-2xl font-bold flex items-center gap-2">🔔 Notifications</h1>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors" onClick={handleMarkAllRead}>Mark all as read</button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-4 w-full">
          {["All", ...types].map(t => (
            <motion.button
              key={t}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 whitespace-nowrap ${
                notifFilter === t
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_8px_2px_rgba(251,191,36,0.5)] ring-2 ring-yellow-300"
                  : "bg-muted text-muted-foreground border-muted hover:bg-muted/80"
              }`}
              onClick={() => setNotifFilter(t)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {t}
            </motion.button>
          ))}
        </div>
        
        {/* Notification List */}
        <div className="bg-gray-100 dark:bg-gray-900 border-none dark:border-zinc-800 rounded-lg shadow p-4 w-full text-black dark:text-white">
          {filtered.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">No notifications.</div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filtered.map(n => {
                  const isUrgent = n.title.toLowerCase().includes("missed");
                  return (
                  <motion.li
                    key={n.id}
                    layout
                      {...(isUrgent ? shakeAnim : { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, transition: { duration: 0.3 } })}
                      className={`flex w-full items-stretch justify-between py-4 gap-4 rounded-lg transition-all border border-gray-200 dark:border-zinc-800 hover:border-primary/40 hover:shadow-md bg-white dark:bg-gradient-to-r from-gray-800 to-zinc-800 px-4 text-black dark:text-white ${typeColors[n.type]}`}
                      onClick={() => setExpanded(expanded === n.id ? null : n.id)}
                      style={{ cursor: "pointer" }}
                  >
                    <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0">{typeIcons[n.type]}</span>
                        <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${n.read ? "bg-gray-400" : "bg-orange-500"}`}></span>
                        <span className="font-semibold text-sm sm:text-base break-words text-left flex-1">{n.title}</span>
                      </div>
                        <AnimatePresence initial={false}>
                          {expanded === n.id ? (
                            <motion.div
                              key="expanded"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-sm text-muted-foreground text-left"
                            >
                              {detailsMap[n.title] || n.desc}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{n.time}</span>
                      <button
                        className={`text-lg p-2 rounded-full border-none bg-transparent hover:bg-orange-100 hover:scale-110 transition-all duration-150 ${n.read ? "text-gray-400" : "text-orange-500"}`}
                          onClick={e => { e.stopPropagation(); handleToggleRead(n.id); }}
                        title={n.read ? "Mark as Unread" : "Mark as Read"}
                      >
                        {n.read ? "🔕" : "🔔"}
                      </button>
                    </div>
                  </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
        
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  export default NotificationsPage; 





