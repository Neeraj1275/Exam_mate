import type { Subject, Stat } from "../types";

export const stats: Stat[] = [
  {
    id: 1,
    label: "Papers Analyzed",
    value: "12",
    description: "Demo data",
  },
  {
    id: 2,
    label: "Questions Found",
    value: "248",
    description: "Demo data",
  },
  {
    id: 3,
    label: "Important Topics",
    value: "36",
    description: "Demo data",
  },
];

export const subjects: Subject[] = [
  {
    id: 1,
    name: "Database Management Systems",
    code: "MCA-201",
    questionCount: 64,
    color: "#e9f0ff",
  },
  {
    id: 2,
    name: "Data Structures",
    code: "MCA-202",
    questionCount: 52,
    color: "#e9f7ef",
  },
  {
    id: 3,
    name: "Operating Systems",
    code: "MCA-203",
    questionCount: 48,
    color: "#fff3e8",
  },
];
