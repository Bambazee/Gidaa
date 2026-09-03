export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  area: string;
  beds: number;
  baths: number;
  type: string;
  badge: "verified" | "new" | "secure";
  power: string;
  water: string;
  security: string;
  bq: boolean;
  studentFriendly: boolean;
  description: string;
  amenities: string[];
  landlord: { name: string; verified: boolean; since: string; properties: number };
  moveInCosts: { rent: number; caution: number; service: number; agency: number; legal: number };
  proximity: { label: string; value: string }[];
}

export const properties: Property[] = [
  {
    id: "1",
    title: "3-Bedroom Flat with BQ in GRA",
    price: 650000,
    location: "Barnawa GRA, Kaduna South",
    area: "Barnawa",
    beds: 3,
    baths: 3,
    type: "3 Bedroom",
    badge: "verified",
    power: "Solar + Gen",
    water: "Borehole",
    security: "Gated Estate",
    bq: true,
    studentFriendly: false,
    description:
      "A well-finished 3-bedroom flat in serene Barnawa GRA. Features POP ceiling, all rooms ensuite, fitted kitchen, interlocked compound, and dedicated security post. Solar inverter provides 18+ hours daily power.",
    amenities: [
      "Solar Inverter (18hrs+)",
      "Borehole Water",
      "Estate Security",
      "POP Ceiling",
      "Fitted Kitchen",
      "Car Parking (2)",
      "Interlocked Compound",
      "Prepaid Meter",
      "BQ with Toilet",
      "Store Room",
    ],
    landlord: { name: "Mallam Yusuf", verified: true, since: "June 2026", properties: 3 },
    moveInCosts: { rent: 650000, caution: 65000, service: 36000, agency: 0, legal: 0 },
    proximity: [
      { label: "ABU Zaria", value: "25 min drive" },
      { label: "Federal Secretariat", value: "12 min drive" },
      { label: "St. Gerard's Church", value: "5 min walk" },
      { label: "Central Mosque", value: "10 min drive" },
      { label: "Barnawa Market", value: "3 min walk" },
      { label: "44 Army Hospital", value: "8 min drive" },
    ],
  },
  {
    id: "2",
    title: "Spacious 2-Bedroom Near KADPOLY",
    price: 350000,
    location: "Tudun Wada, Kaduna",
    area: "Tudun Wada",
    beds: 2,
    baths: 2,
    type: "2 Bedroom",
    badge: "secure",
    power: "Gen + PHCN",
    water: "Well",
    security: "Street Gate",
    bq: false,
    studentFriendly: true,
    description:
      "Clean 2-bedroom flat just 5 minutes walk from KADPOLY main campus. Suitable for students or young professionals. Shared compound with 4 other flats.",
    amenities: [
      "Generator Backup",
      "Shared Borehole",
      "Street Gate",
      "Tiled Floor",
      "Fenced Compound",
      "Prepaid Meter",
    ],
    landlord: { name: "Mrs. Grace John", verified: true, since: "March 2026", properties: 5 },
    moveInCosts: { rent: 350000, caution: 35000, service: 0, agency: 0, legal: 0 },
    proximity: [
      { label: "KADPOLY", value: "5 min walk" },
      { label: "Tudun Wada Market", value: "10 min walk" },
      { label: "Barnawa", value: "15 min drive" },
    ],
  },
  {
    id: "3",
    title: "Self-Contained Studio — Samaru",
    price: 180000,
    location: "Samaru, Zaria (ABU Axis)",
    area: "Samaru",
    beds: 1,
    baths: 1,
    type: "Self-Contained",
    badge: "verified",
    power: "PHCN Only",
    water: "Borehole",
    security: "Personal Gate",
    bq: false,
    studentFriendly: true,
    description:
      "Compact self-contained room perfect for ABU students. Private kitchen and bathroom. Quiet neighborhood with other students.",
    amenities: ["Private Kitchen", "Private Bath", "Borehole Water", "Tiled Floor", "Study Desk Space"],
    landlord: { name: "Alhaji Sule", verified: true, since: "Jan 2026", properties: 8 },
    moveInCosts: { rent: 180000, caution: 20000, service: 0, agency: 0, legal: 0 },
    proximity: [
      { label: "ABU Main Campus", value: "10 min walk" },
      { label: "Samaru Market", value: "5 min walk" },
      { label: "Zaria Town", value: "20 min drive" },
    ],
  },
  {
    id: "4",
    title: "4-Bedroom Duplex — Malali",
    price: 1200000,
    location: "Malali GRA, Kaduna North",
    area: "Malali",
    beds: 4,
    baths: 4,
    type: "Duplex",
    badge: "verified",
    power: "24/7 Solar",
    water: "Borehole",
    security: "Estate + Guards",
    bq: true,
    studentFriendly: false,
    description:
      "Luxury 4-bedroom duplex in prestigious Malali GRA. Two sitting rooms, dining area, massive kitchen, 2 BQs, and space for 3 cars. 24/7 solar power system.",
    amenities: [
      "24/7 Solar Power",
      "Borehole Water",
      "Estate Security + Guards",
      "POP Ceiling",
      "Fitted Kitchen",
      "Car Parking (3)",
      "2 BQs",
      "Garden Space",
      "Prepaid Meter",
    ],
    landlord: { name: "Dr. Ibrahim Musa", verified: true, since: "April 2026", properties: 2 },
    moveInCosts: { rent: 1200000, caution: 120000, service: 60000, agency: 0, legal: 0 },
    proximity: [
      { label: "Federal Secretariat", value: "8 min drive" },
      { label: "44 Army Hospital", value: "5 min drive" },
      { label: "Malali Market", value: "3 min walk" },
      { label: "Kaduna Club", value: "10 min walk" },
    ],
  },
];

export const areas = [
  "All",
  "Barnawa",
  "Malali",
  "Ungwan Rimi",
  "Sabon Tasha",
  "Kakuri",
  "Tudun Wada",
  "Rigasa",
  "Samaru",
  "Kawo",
  "Badiko",
  "Command",
];

export const types = [
  "All",
  "Self-Contained",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "4+ Bedroom",
  "Duplex",
];
