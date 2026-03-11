"use client";

import {
  FaRunning,
  FaHiking,
  FaDumbbell,
  FaQuestionCircle,
} from "react-icons/fa";
import { GiTennisRacket, GiMeditation, GiHighKick } from "react-icons/gi";

const ICON_CLASS = "h-6 w-6 text-emerald-400 shrink-0";

const TYPE_TO_ICON: Record<string, React.ReactNode> = {
  run: <FaRunning className={ICON_CLASS} />,
  lift: <FaDumbbell className={ICON_CLASS} />,
  yoga: <GiMeditation className={ICON_CLASS} />,
  tennis: <GiTennisRacket className={ICON_CLASS} />,
  hike: <FaHiking className={ICON_CLASS} />,
  hiking: <FaHiking className={ICON_CLASS} />,
  "muay thai": <GiHighKick className={ICON_CLASS} />,
  other: <FaQuestionCircle className={ICON_CLASS} />,
};

function getIconForType(type: string): React.ReactNode {
  const key = type.toLowerCase().trim();
  return TYPE_TO_ICON[key] ?? TYPE_TO_ICON.other;
}

interface WorkoutTypeIconProps {
  type: string;
  className?: string;
}

export function WorkoutTypeIcon({ type, className }: WorkoutTypeIconProps) {
  return (
    <span className={`inline-flex items-center justify-center ${className ?? ""}`}>
      {getIconForType(type)}
    </span>
  );
}
