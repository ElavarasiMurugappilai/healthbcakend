import React, { useEffect, useState } from "react";
import API from "../api"; // Your authenticated Axios instance
import toast from "../components/ui/use-toast"; // Sonner toast
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  refId?: string;
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Medication", value: "medication" },
  { label: "Appointments", value: "appointment" },
  { label: "Challenge", value: "challenge" },
  { label: "System", value: "system" },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notifications");
      if (res.data.success) {
        setNotifications(res.data.notifications);
      } else {
        toast.error(res.data.message || "Failed to fetch notifications");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read/unread
  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      const res = await API.patch(`/notifications/${id}/read`, { isRead: !isRead });
      if (res.data.success) {
        toast.success(res.data.message || "Notification updated");
        fetchNotifications();
      } else {
        toast.error(res.data.message || "Failed to update notification");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating notification");
    }
  };

  // Filter notifications
  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type.toLowerCase().includes(filter));

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Notifications</h2>
            <div className="flex gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.value}
                  variant={filter === f.value ? "default" : "outline"}
                  onClick={() => setFilter(f.value)}
                  className="text-xs"
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">No notifications found.</div>
          ) : (
            <ul className="space-y-2">
              {filteredNotifications.map((n) => (
                <li
                  key={n._id}
                  className={`flex items-center justify-between px-4 py-3 rounded border ${n.isRead ? "bg-gray-100" : "bg-blue-50"} transition`}
                >
                  <div>
                    <div className="font-semibold">{n.message}</div>
                    <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <Button
                    variant={n.isRead ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleRead(n._id, n.isRead)}
                  >
                    {n.isRead ? "Mark Unread" : "Mark Read"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;






