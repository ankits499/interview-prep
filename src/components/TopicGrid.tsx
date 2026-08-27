import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { TOPICS, getConceptsForTopic, getQuestionsForTopic } from "../content";
import { getSubtopicsForTopic } from "../content/subtopics";
import { useProgress } from "../hooks/useProgress";
import { useConceptProgress } from "../hooks/useConceptProgress";
import { getProgressStats } from "../lib/progressStats";
import { ProgressRing } from "./ProgressRing";

export function TopicGrid() {
  const { progress } = useProgress();
  const { isReviewed } = useConceptProgress();

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      {TOPICS.map((topic) => {
        const stats = getProgressStats(
          getConceptsForTopic(topic.id),
          getQuestionsForTopic(topic.id),
          isReviewed,
          progress,
        );

        return (
          <Link
            key={topic.id}
            to={`/topic/${topic.id}`}
            className="group flex min-w-0 flex-col justify-between rounded-lg border border-border bg-surface p-3.5 transition-colors hover:border-accent sm:p-5"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="min-w-0">
                <h3 className="font-mono text-sm font-semibold text-ink">
                  {topic.label}
                </h3>
                <p className="mt-2 text-xs text-ink-muted sm:text-sm">
                  {topic.description}
                </p>
              </div>
              {stats.total > 0 && (
                <div className="relative shrink-0">
                  <ProgressRing
                    percent={stats.percent}
                    size={30}
                    strokeWidth={2.5}
                    className="sm:hidden"
                  />
                  <ProgressRing
                    percent={stats.percent}
                    size={38}
                    strokeWidth={3}
                    className="hidden sm:block"
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-ink-muted sm:text-[9px]">
                    {stats.percent}%
                  </span>
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono text-[10px] text-ink-muted sm:mt-4 sm:text-xs">
              <span>
                {getSubtopicsForTopic(topic.id).length} subtopics ·{" "}
                {topic.questionCount} Q&amp;A
              </span>
              <ArrowRight
                size={14}
                className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
