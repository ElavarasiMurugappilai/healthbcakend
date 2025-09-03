import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API from "@/api";

interface TimeSlot {
  time: string;
  available: boolean;
  booked?: boolean;
}

interface TimeSlotPickerProps {
  selectedDate: string;
  doctorId: string;
  onTimeSelect: (time: string) => void;
  selectedTime: string;
}

const TimeSlotPicker = ({ selectedDate, doctorId, onTimeSelect, selectedTime }: TimeSlotPickerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate default time slots (9 AM to 5 PM)
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: true,
          booked: false
        });
      }
    }
    return slots;
  };

  // Check availability for selected date and doctor
  const checkAvailability = async () => {
    if (!selectedDate || !doctorId) return;

    setLoading(true);
    try {
      const response = await API.get(`/appointments/availability`, {
        params: {
          date: selectedDate,
          doctorId: doctorId
        }
      });

      const bookedSlots = response.data.bookedSlots || [];
      const defaultSlots = generateTimeSlots();

      const updatedSlots = defaultSlots.map(slot => ({
        ...slot,
        available: !bookedSlots.includes(slot.time),
        booked: bookedSlots.includes(slot.time)
      }));

      setTimeSlots(updatedSlots);
    } catch (error) {
      console.error('Failed to check availability:', error);
      // Fallback to default slots if API fails
      setTimeSlots(generateTimeSlots());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [selectedDate, doctorId]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="text-center text-sm text-muted-foreground">
          Loading available time slots...
        </div>
      </Card>
    );
  }

  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  const renderTimeSlots = (slots: TimeSlot[], title: string) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.time}
            variant={selectedTime === slot.time ? "default" : "outline"}
            size="sm"
            disabled={!slot.available || slot.booked}
            onClick={() => onTimeSelect(slot.time)}
            className={`text-xs ${
              slot.booked 
                ? "opacity-50 cursor-not-allowed" 
                : slot.available 
                  ? "hover:bg-primary/10" 
                  : "opacity-50 cursor-not-allowed"
            }`}
          >
            {slot.time}
            {slot.booked && (
              <Badge variant="destructive" className="ml-1 text-xs">
                Booked
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Available Time Slots</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkAvailability}
          className="text-xs"
        >
          Refresh
        </Button>
      </div>
      
      {selectedDate && (
        <div className="text-xs text-muted-foreground">
          Showing availability for {new Date(selectedDate).toLocaleDateString()}
        </div>
      )}

      <div className="space-y-4">
        {renderTimeSlots(morningSlots, "Morning (9:00 AM - 11:30 AM)")}
        {renderTimeSlots(afternoonSlots, "Afternoon (12:00 PM - 5:30 PM)")}
      </div>

      {timeSlots.filter(slot => slot.available && !slot.booked).length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No available time slots for this date. Please select a different date.
        </div>
      )}
    </Card>
  );
};

export default TimeSlotPicker;
