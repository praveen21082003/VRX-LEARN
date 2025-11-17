import React from "react";

function DailyQuote() {
  const quotes = [
    "Believe in yourself — you are stronger than you think.",
    "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
    "Push yourself, because no one else is going to do it for you.",
    "Dream big. Work hard. Stay humble.",
    "Don’t watch the clock; do what it does. Keep going.",
    "Every day is a new opportunity to improve yourself.",
    "Your only limit is your mind.",
  ];

  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  const quote = quotes[dayOfYear % quotes.length];

  return (
    <div className="text-center py-2">
      <p className="text-lg italic font-semibold">"{quote}"</p>
      <p className="text-sm mt-2 opacity-80">— Daily Motivation</p>
    </div>
  );
}

export default DailyQuote;
