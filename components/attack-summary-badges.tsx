import {
  cn,
  getAttackTypeBadgeClass,
  getAttackTypeDisplay,
  getTargetingLevelClass,
  getTargetingLevelDisplay,
} from "@/lib/utils";

interface AttackSummaryBadgesProps {
  attackType?: string;
  targetingLevel?: string;
}

export function AttackSummaryBadges({
  attackType,
  targetingLevel,
}: AttackSummaryBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge
        label="Attack Type"
        value={getAttackTypeDisplay(attackType)}
        className={getAttackTypeBadgeClass(attackType)}
      />
      <Badge
        label="Targeting Level"
        value={getTargetingLevelDisplay(targetingLevel)}
        className={getTargetingLevelClass(targetingLevel)}
      />
    </div>
  );
}

function Badge({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2",
        className,
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.24em] opacity-80">
        {label}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
