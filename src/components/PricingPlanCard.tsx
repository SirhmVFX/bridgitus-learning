"use client";

import Link from "next/link";
import type { SitePricingPlan } from "@/lib/firestore";
import { isFamilyPlan } from "@/lib/pricingPlans";

type PricingPlanCardProps = {
  plan: SitePricingPlan;
  /** When set, card uses a button CTA instead of a link (e.g. register flow). */
  onSelect?: (plan: SitePricingPlan) => void;
  selected?: boolean;
  /** Extra line under description (register flow). */
  showStudentLimitHint?: boolean;
};

const CARD_GLOW =
  "0 0 0 2px rgba(37, 99, 235, 0.55), 0 0 28px rgba(59, 130, 246, 0.55), 0 0 56px rgba(96, 165, 250, 0.4)";
const CARD_GLOW_STRONG =
  "0 0 0 3px rgba(37, 99, 235, 0.7), 0 0 36px rgba(59, 130, 246, 0.7), 0 12px 40px rgba(37, 99, 235, 0.25)";

export default function PricingPlanCard({
  plan,
  onSelect,
  selected = false,
  showStudentLimitHint = false,
}: PricingPlanCardProps) {
  const family = isFamilyPlan(plan);
  const ctaClass = `w-full py-3.5 text-sm font-bold text-center cursor-pointer
    transition-all duration-300 ease-out will-change-transform
    hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,31,91,0.35)]
    active:scale-[0.98]
    ${
      plan.highlighted
        ? "bg-secondary-color text-white hover:bg-secondary-color/90"
        : "bg-[#001f5b] text-white hover:bg-[#001040]"
    }`;

  return (
    <div
      className={`group relative bg-white flex flex-col overflow-hidden rounded-2xl
        transition-all duration-300 ease-out cursor-pointer
        ${
          selected
            ? "ring-2 ring-blue-500 bg-blue-50/40"
            : plan.highlighted
              ? "ring-2 ring-secondary-color"
              : "border border-gray-200"
        }
        hover:bg-blue-50/50 hover:border-blue-400 hover:ring-2 hover:ring-blue-500/80
        hover:-translate-y-1.5
      `}
      style={{
        boxShadow: selected ? CARD_GLOW_STRONG : undefined,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = CARD_GLOW_STRONG;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = selected ? CARD_GLOW : "";
      }}
      onClick={onSelect ? () => onSelect(plan) : undefined}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(plan);
              }
            }
          : undefined
      }
    >
      {/* Soft blue wash on hover — matches the reference glow card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
          bg-[radial-gradient(ellipse_at_center,rgba(147,197,253,0.45),rgba(219,234,254,0.35)_40%,transparent_70%)]"
      />

      {plan.highlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-color z-[1]" />
      )}
      {plan.highlighted && (
        <div className="absolute top-3 right-3 bg-secondary-color text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide z-[1]">
          Most Popular
        </div>
      )}

      <div className="relative z-[1] p-6 flex flex-col flex-1 gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">{plan.title}</h2>
            <p className="text-gray-500 text-sm mt-0.5">({plan.tagline})</p>
          </div>
          {plan.icon && <span className="text-3xl shrink-0">{plan.icon}</span>}
        </div>

        <div>
          <div className="flex items-end gap-1 flex-wrap">
            <span className="text-5xl font-black text-gray-900 leading-none">{plan.price}</span>
            <span className="text-gray-500 text-base font-medium mb-1">{plan.per}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">AUD</p>
        </div>

        {plan.badge && (
          <div className="inline-block bg-secondary-color text-white text-sm font-bold px-4 py-1.5 w-fit">
            {plan.badge}
          </div>
        )}

        {plan.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
        )}

        {showStudentLimitHint && (
          <p className="text-xs font-semibold text-secondary-color">
            {family ? "Register up to 3 students" : "Register 1 student"}
          </p>
        )}

        {onSelect ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan);
            }}
            className={ctaClass}
          >
            {plan.ctaLabel?.replace(/^Book/i, "Select") ?? `Select ${plan.title}`}
          </button>
        ) : (
          <Link
            href={`/register?plan=${encodeURIComponent(plan.title)}`}
            className={ctaClass}
            onClick={(e) => e.stopPropagation()}
          >
            {plan.ctaLabel ?? "Book your lesson now"}
          </Link>
        )}

        {plan.features && plan.features.length > 0 && (
          <div>
            <p className="font-bold text-secondary-color text-sm mb-3">What&apos;s Included:</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-base">
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-xs leading-tight">{f.title}</p>
                    <p className="text-gray-400 text-xs leading-tight mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!plan.features || plan.features.length === 0) && plan.perks?.length > 0 && (
          <div className="space-y-2">
            {plan.perks.map((perk, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-secondary-color text-base shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-gray-600">{perk.desc}</p>
              </div>
            ))}
          </div>
        )}

        {plan.freePerks && plan.freePerks.length > 0 && (
          <>
            <div className="h-px bg-gray-100" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-2">Free Perks</p>
              <div className="space-y-2">
                {plan.freePerks.map((perk, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-500 text-base shrink-0 mt-0.5 font-bold">✓</span>
                    <p className="text-sm text-gray-600">{perk}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {(plan.bottomNote1 || plan.bottomNote2) && (
          <>
            <div className="h-px bg-gray-100 mt-auto" />
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {plan.bottomNote1 && (
                <div className="flex items-start gap-1.5">
                  <span className="text-secondary-color shrink-0">♡</span>
                  <span>{plan.bottomNote1}</span>
                </div>
              )}
              {plan.bottomNote2 && (
                <div className="flex items-start gap-1.5">
                  <span className="text-secondary-color shrink-0">🛡</span>
                  <span>{plan.bottomNote2}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
