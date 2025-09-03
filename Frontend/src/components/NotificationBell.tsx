import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import API from "../api.js";
import { toast } from "./ui/use-toast";

interface NotificationBellProps {
  /** Optionally trigger a refresh from parent (e.g. after marking read) */
  refreshTrigger?: any;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ refreshTrigger }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();

  // Fetch unread count from backend
  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/notifications/unread-count");
      if (res.data.success) {
        setUnreadCount(res.data.count);
      } else {
        toast.error(res.data.message || "Failed to fetch unread count");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error fetching unread count");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Optionally re-fetch when refreshTrigger changes
  }, [refreshTrigger]);

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <Bell className="w-6 h-6 text-gray-700" />
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs"
        >
          {unreadCount}
        </Badge>
      )}
    </div>
  );
};

export default NotificationBell;