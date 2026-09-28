/**
 * Comprehensive Indian Calendar: Festivals, Jayantis, and National Observances.
 * Format: MM-DD
 */
export const INDIAN_FESTIVALS = {
  // January
  "01-01": "Happy New Year",
  "01-12": "National Youth Day (Swami Vivekananda Jayanti)",
  "01-14": "Makar Sankranti / Pongal",
  "01-15": "Army Day",
  "01-23": "Parakram Diwas (Netaji Subhas Chandra Bose Jayanti)",
  "01-26": "Republic Day",

  // February
  "02-19": "Chhatrapati Shivaji Maharaj Jayanti",
  "02-28": "National Science Day",

  // March
  "03-08": "International Women's Day / Maha Shivratri",
  "03-14": "Holi (Festival of Colors)",
  "03-23": "Shaheed Diwas (Bhagat Singh, Sukhdev & Rajguru)",
  "03-30": "Eid-ul-Fitr (approx.) / Chaitra Navratri",

  // April
  "04-06": "Ram Navami",
  "04-10": "Mahavir Jayanti",
  "04-14": "Dr. B.R. Ambedkar Jayanti",
  "04-18": "Good Friday",

  // May
  "05-01": "Maharashtra Day / International Labour Day",
  "05-12": "Buddha Purnima",

  // June
  "06-07": "Bakrid / Eid-ul-Adha",
  "06-21": "International Yoga Day",

  // July
  "07-06": "Muharram",
  "07-10": "Guru Purnima",

  // August
  "08-09": "Raksha Bandhan",
  "08-15": "Independence Day",
  "08-16": "Janmashtami",
  "08-27": "Ganesh Chaturthi",

  // September
  "09-05": "Teachers' Day (Dr. Radhakrishnan Jayanti)",
  "09-15": "Engineers' Day (Sir M. Visvesvaraya Jayanti)",
  "09-28": "Shaheed Bhagat Singh Birth Anniversary",

  // October
  "10-02": "Gandhi Jayanti & Lal Bahadur Shastri Jayanti",
  "10-20": "Maha Navami / Dussehra (Vijayadashami)",
  "10-29": "Dhanteras",
  "10-31": "Diwali (Deepavali) & Sardar Patel Jayanti",

  // November
  "11-01": "Govardhan Puja",
  "11-02": "Bhai Dooj",
  "11-05": "Chhath Puja",
  "11-14": "Children's Day (Jawaharlal Nehru Jayanti)",
  "11-15": "Guru Nanak Jayanti (Gurpurab) & Birsa Munda Jayanti",
  "11-26": "Constitution Day (Samvidhan Diwas)",

  // December
  "12-04": "Indian Navy Day",
  "12-22": "National Mathematics Day (Srinivasa Ramanujan Jayanti)",
  "12-23": "Kisan Diwas (Chaudhary Charan Singh Jayanti)",
  "12-25": "Christmas / Good Governance Day (Atal Bihari Vajpayee Jayanti)",
};

/**
 * Checks whether today is a festival or 1st day of a new month.
 * Target Timezone: Asia/Kolkata (IST)
 */
export function getIndianCalendarEvent(targetDate = new Date()) {
  const istFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    weekday: "long",
  });

  const parts = Object.fromEntries(
    istFormatter.formatToParts(targetDate).map((p) => [p.type, p.value]),
  );

  const monthDay = `${parts.month}-${parts.day}`;
  const isFirstDayOfMonth = parts.day === "01";
  const monthName = targetDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    month: "long",
  });

  return {
    monthDay,
    dayOfWeek: parts.weekday,
    isFirstDayOfMonth,
    monthName,
    festival: INDIAN_FESTIVALS[monthDay] || null,
  };
}
