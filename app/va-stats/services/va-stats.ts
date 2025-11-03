import { supabase } from "@/lib/supabase";
import { Client } from "@/app/clients/types";
import { DateRange, VAStatsResponse, VAStatsRow } from "../types";

type RevisionLog = {
  id: number;
  created_at: string | null;
  task_name: string | null;
  task_id: string | null;
  asignee: string | null;
  finished_at: string | null;
};

const minutesToDuration = (totalMinutes: number): string => {
  if (!isFinite(totalMinutes) || totalMinutes <= 0) return "0d 0h 0m";
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
};

const diffMinutes = (start: string | null, end: string | null): number => {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (!isFinite(s) || !isFinite(e) || e <= s) return 0;
  return Math.floor((e - s) / (1000 * 60));
};

const avgMinutes = (values: number[]): number => {
  const valid = values.filter((v) => v > 0);
  if (valid.length === 0) return 0;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
};

export const fetchVAStats = async (
  dateRange: DateRange
): Promise<VAStatsResponse> => {
  const { startDate, endDate } = dateRange;

  // Fetch clients with a delivery person (VA)
  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .not("delivery_person", "is", null);

  if (clientsError) {
    throw new Error(`Failed to fetch clients: ${clientsError.message}`);
  }

  const clients = (clientsData || []) as Client[];

  // Fetch revision logs
  const { data: logsData, error: logsError } = await supabase
    .from("website_revision_logs")
    .select("id, created_at, task_name, task_id, asignee, finished_at");

  if (logsError) {
    throw new Error(
      `Failed to fetch website_revision_logs: ${logsError.message}`
    );
  }

  const logs = (logsData || []) as RevisionLog[];

  // Determine unique VA names from clients.delivery_person and logs.asignee
  const vaSet = new Set<string>();
  clients.forEach((c) => {
    if (c.delivery_person) vaSet.add(c.delivery_person);
  });
  logs.forEach((l) => {
    if (l.asignee) vaSet.add(l.asignee);
  });
  const disallowedVAs = new Set(["Yennifer", "No match"]);
  const vaList = Array.from(vaSet).filter(
    (v) => v && v.trim().length > 0 && !disallowedVAs.has(v.trim())
  );

  const rows: VAStatsRow[] = vaList.map((va) => {
    // Sites metrics (from clients)
    const vaClients = clients.filter((c) => c.delivery_person === va);

    const completedInRange = vaClients.filter((c) => {
      if (!c.site_done_at) return false;
      const done = new Date(c.site_done_at);
      return done >= new Date(startDate) && done <= new Date(endDate);
    });

    console.log({ completedInRange });

    const sitesCompleted = completedInRange.length;
    const siteDurations = completedInRange.map((c) =>
      diffMinutes(c.started_on, c.site_done_at)
    );
    const sitesAvgCompletionTime = minutesToDuration(avgMinutes(siteDurations));

    const openProjects = vaClients.filter(
      (c) => !c.site_done_at && c.started_on
    ).length;

    // Revision metrics (from website_revision_logs)
    const vaLogs = logs.filter((l) => l.asignee === va);

    const completedLogsInRange = vaLogs.filter((l) => {
      if (!l.finished_at) return false;
      const finished = new Date(l.finished_at);
      return finished >= new Date(startDate) && finished <= new Date(endDate);
    });

    const revisionsCompleted = completedLogsInRange.length;
    const revisionDurations = completedLogsInRange.map((l) =>
      diffMinutes(l.created_at, l.finished_at)
    );
    const revisionsAvgCompletionTime = minutesToDuration(
      avgMinutes(revisionDurations)
    );

    const openRevisions = vaLogs.filter((l) => !l.finished_at).length;

    return {
      va,
      sitesCompleted,
      sitesAvgCompletionTime,
      openProjects,
      revisionsCompleted,
      revisionsAvgCompletionTime,
      openRevisions,
    };
  });

  // Totals row
  const totals: VAStatsRow = {
    va: "TOTAL",
    sitesCompleted: rows.reduce((s, r) => s + r.sitesCompleted, 0),
    sitesAvgCompletionTime: minutesToDuration(
      avgMinutes(
        rows.flatMap((r) => {
          // Derive back to minutes by parsing duration strings of each row
          // This uses a simple parser matching the format we produce
          const m = r.sitesAvgCompletionTime.match(/(\d+)d\s*(\d+)h\s*(\d+)m/);
          if (!m) return [0];
          const days = parseInt(m[1]);
          const hours = parseInt(m[2]);
          const mins = parseInt(m[3]);
          return [days * 24 * 60 + hours * 60 + mins];
        })
      )
    ),
    openProjects: rows.reduce((s, r) => s + r.openProjects, 0),
    revisionsCompleted: rows.reduce((s, r) => s + r.revisionsCompleted, 0),
    revisionsAvgCompletionTime: minutesToDuration(
      avgMinutes(
        rows.flatMap((r) => {
          const m = r.revisionsAvgCompletionTime.match(
            /(\d+)d\s*(\d+)h\s*(\d+)m/
          );
          if (!m) return [0];
          const days = parseInt(m[1]);
          const hours = parseInt(m[2]);
          const mins = parseInt(m[3]);
          return [days * 24 * 60 + hours * 60 + mins];
        })
      )
    ),
    openRevisions: rows.reduce((s, r) => s + r.openRevisions, 0),
  };

  return { rows, totals };
};
