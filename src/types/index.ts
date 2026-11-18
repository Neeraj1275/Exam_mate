export interface Subject {
  id: number;
  name: string;
  code: string;
  questionCount: number;
  color: string;
}

export interface Stat {
  id: number;
  label: string;
  value: string;
  description: string;
}
