"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
  isWeekend,
  isPast,
  isBefore,
  isAfter,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import { SelectedSlot } from "@/types/calendar";

type TimeSlot = {
  time: string;
  formattedTime: string;
};

const CalendarSelector = ({
  selectedSlots,
  onSlotToggle,
}: {
  selectedSlots: SelectedSlot[];
  onSlotToggle: (date: Date, time: string) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Generate time slots from 7 AM to 8 PM in 30-minute intervals
  useEffect(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const date = new Date();
        const [h, m] = time.split(":").map(Number);
        date.setHours(h, m, 0, 0);

        slots.push({
          time,
          formattedTime: date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        });
      }
    }
    setTimeSlots(slots);
  }, []);

  // Helper function to check if a slot is selected
  const isSlotSelected = (date: Date, time: string) => {
    return selectedSlots.some(
      (slot) => isSameDay(new Date(slot.date), date) && slot.time === time
    );
  };

  // Get days for the current month view
  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDateSelect = (date: Date) => {
    // Only allow selection of current or future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date >= today) {
      setSelectedDate(date);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    // Don't allow going to past months
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);

    if (currentMonth > today) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const hasSlotsOnDay = (day: Date) => {
    return selectedSlots.some((slot) => isSameDay(new Date(slot.date), day));
  };

  const isDayDisabled = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day < today;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 ">
        {/* Month/Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={isSameMonth(currentMonth, new Date())}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>

          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;
            const hasSlots = hasSlotsOnDay(day);
            const disabled = isDayDisabled(day);
            const isWeekendDay = isWeekend(day);
            const isTodayDate = isToday(day);

            return (
              <button
                key={i}
                onClick={() => handleDateSelect(day)}
                disabled={disabled}
                className={`
                  relative p-2 h-12 rounded-md text-sm font-medium
                  ${!isCurrentMonth ? "text-gray-300" : ""}
                  ${isSelected ? "bg-primary-color text-white" : ""}
                  ${disabled ? "cursor-not-allowed text-gray-300" : "hover:bg-gray-100"}
                  ${isTodayDate && !isSelected ? "bg-blue-50 text-primary-color" : ""}
                  ${isWeekendDay ? "text-gray-500" : ""}
                  transition-colors duration-150
                `}
              >
                <span
                  className={`${isTodayDate && !isSelected ? "font-bold" : ""}`}
                >
                  {format(day, "d")}
                </span>
                {hasSlots && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-color"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className=" md:p-8 p-4">
          <h3 className="text-lg font-medium mb-4">
            Available time slots for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot, index) => {
              const isSelected = isSlotSelected(selectedDate, slot.time);
              const slotDateTime = new Date(selectedDate);
              const [hours, minutes] = slot.time.split(":").map(Number);
              slotDateTime.setHours(hours, minutes, 0, 0);
              const isPastSlot = isBefore(slotDateTime, new Date());

              return (
                <button
                  key={index}
                  onClick={() =>
                    !isPastSlot && onSlotToggle(selectedDate, slot.time)
                  }
                  disabled={isPastSlot}
                  className={`
                    p-3 rounded-lg border text-sm font-medium
                    ${isSelected ? "bg-primary-color text-white border-primary-color" : ""}
                    ${isPastSlot ? "opacity-50 cursor-not-allowed" : "hover:border-primary-color/50"}
                    ${!isSelected && !isPastSlot ? "border-gray-200" : ""}
                    transition-colors duration-150
                  `}
                >
                  {slot.formattedTime}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSelector;
