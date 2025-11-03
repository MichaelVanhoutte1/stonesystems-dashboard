export interface DateRange {
  startDate: string; // ISO string
  endDate: string; // ISO string
}

export interface VAStatsRow {
  va: string;
  sitesCompleted: number;
  sitesAvgCompletionTime: string; // e.g. "4d 8h 54m"
  openProjects: number;
  revisionsCompleted: number;
  revisionsAvgCompletionTime: string; // e.g. "3d 5h 38m"
  openRevisions: number;
}

export interface VAStatsResponse {
  rows: VAStatsRow[];
  totals: VAStatsRow; // va === "TOTAL"
}
