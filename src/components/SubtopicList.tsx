import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { ConceptSection, Question } from "../types";
import { getSubtopicsForTopic } from "../content/subtopics";
import { useProgress } from "../hooks/useProgress";
import { useConceptProgress } from "../hooks/useConceptProgress";
import { getProgressStats } from "../lib/progressStats";
import { ProgressRing } from "./ProgressRing";

export function SubtopicList({
  topicId,
  concepts,
  questions,
}: {
  topicId: string;
  concepts: ConceptSection[];
  questions: Question[];
}) {
  const subtopics = getSubtopicsForTopic(topicId);
  const { progress } = useProgress();
  const { isReviewed } = useConceptProgress();

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-1">
      {subtopics.map((s, i) => {
        const hasConcept = concepts.some((c) => c.subtopic === s.id);
        const subtopicSections = concepts.filter((c) => c.subtopic === s.id);
        const subtopicQuestions = questions.filter((q) => q.subtopic === s.id);
        const stats = getProgressStats(
          subtopicSections,
          subtopicQuestions,
          isReviewed,
          progress,
        );

        return (
          <Link
            key={s.id}
            to={`/topic/${topicId}/subtopic/${s.id}`}
            className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 transition-colors hover:border-accent"
          >
            <span className="w-7 shrink-0 font-mono text-xs text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-ink">{s.label}</p>
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                {hasConcept ? "Study material" : "Coming soon"}
                {subtopicQuestions.length > 0 &&
                  ` · ${subtopicQuestions.length} Q&A`}
              </p>
            </div>
            {stats.total > 0 && (
              <div className="relative shrink-0">
                <ProgressRing
                  percent={stats.percent}
                  size={28}
                  strokeWidth={2.5}
                />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-ink-muted">
                  {stats.percent}%
                </span>
              </div>
            )}
            <ChevronRight size={14} className="shrink-0 text-ink-muted" />
          </Link>
        );
      })}
    </div>
  );
}
