"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import {
  getMaterialsByGrade,
  getMaterialCompletions,
  markMaterialComplete,
  unmarkMaterialComplete,
  isMaterialCompleted,
  type LearningMaterial,
  type MaterialCompletion,
} from "@/lib/firestore";
import {
  MdMenuBook, MdPictureAsPdf, MdImage, MdVideoLibrary,
  MdLink, MdArticle, MdDownload, MdOpenInNew,
  MdCheckCircle, MdRadioButtonUnchecked, MdLock,
  MdTimer, MdFilterList, MdSearch,
} from "react-icons/md";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  text: <MdArticle size={18} />,
  document: <MdArticle size={18} />,
  pdf: <MdPictureAsPdf size={18} />,
  image: <MdImage size={18} />,
  video: <MdVideoLibrary size={18} />,
  link: <MdLink size={18} />,
  mixed: <MdMenuBook size={18} />,
};

const TYPE_COLORS: Record<string, string> = {
  text: "bg-blue-100 text-blue-700",
  document: "bg-indigo-100 text-indigo-700",
  pdf: "bg-red-100 text-red-700",
  image: "bg-green-100 text-green-700",
  video: "bg-purple-100 text-purple-700",
  link: "bg-amber-100 text-amber-700",
  mixed: "bg-gray-100 text-gray-700",
};

function formatTime(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ── Material Card ─────────────────────────────────────────

function MaterialCard({
  material,
  index,
  isCompleted,
  isLocked,
  onToggleComplete,
  toggling,
}: {
  material: LearningMaterial;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  onToggleComplete: (m: LearningMaterial) => void;
  toggling: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white border transition-all ${isCompleted ? "border-emerald-300 bg-emerald-50/30" :
        isLocked ? "border-gray-200 opacity-60" :
          "border-gray-200"
      }`}>
      {/* Status stripe */}
      <div className={`h-1 w-full ${isCompleted ? "bg-emerald-500" : isLocked ? "bg-gray-200" : "bg-secondary-color"}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Number + complete toggle */}
          <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${isCompleted ? "bg-emerald-500 text-white" :
                isLocked ? "bg-gray-200 text-gray-400" :
                  "bg-secondary-color text-white"
              }`}>
              {isLocked ? <MdLock size={14} /> : index + 1}
            </div>
            {!isLocked && (
              <button
                onClick={() => onToggleComplete(material)}
                disabled={toggling}
                title={isCompleted ? "Mark incomplete" : "Mark as complete"}
                className="text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-40"
              >
                {isCompleted
                  ? <MdCheckCircle size={22} className="text-emerald-500" />
                  : <MdRadioButtonUnchecked size={22} />}
              </button>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[material.type] ?? TYPE_COLORS.mixed}`}>
                {TYPE_ICONS[material.type]}
                {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5">{material.subject}</span>
              {material.estimatedMinutes && (
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <MdTimer size={12} /> {formatTime(material.estimatedMinutes)}
                </span>
              )}
              {isCompleted && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                  <MdCheckCircle size={12} /> Completed
                </span>
              )}
            </div>

            <h3 className={`font-semibold text-base ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
              {material.title}
            </h3>

            {isLocked ? (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MdLock size={12} /> Complete the previous material to unlock this one.
              </p>
            ) : (
              <>
                {material.description && (
                  <div
                    className={`text-sm text-gray-500 mt-1 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
                    dangerouslySetInnerHTML={{ __html: material.description }}
                  />
                )}

                {material.content && expanded && (
                  <div
                    className="mt-4 prose prose-sm max-w-none text-gray-700 border-t border-gray-100 pt-4"
                    dangerouslySetInnerHTML={{ __html: material.content }}
                  />
                )}

                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  {material.content && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-xs font-medium text-secondary-color hover:underline"
                    >
                      {expanded ? "Show less ↑" : "Read lesson ↓"}
                    </button>
                  )}
                  {material.fileUrl && (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-secondary-color text-white text-xs font-semibold px-3 py-1.5 hover:bg-secondary-color/90 transition-colors"
                    >
                      <MdDownload size={13} />
                      {material.type === "pdf" ? "Open PDF" :
                        material.type === "image" ? "View Image" :
                          material.type === "video" ? "Watch Video" : "Download"}
                    </a>
                  )}
                  {material.linkUrl && (
                    <a
                      href={material.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 hover:bg-amber-600 transition-colors"
                    >
                      <MdOpenInNew size={13} />
                      {material.linkLabel ?? "Open Resource"}
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail */}
          {material.thumbnailUrl && !isLocked && (
            <div className="w-20 h-16 shrink-0 hidden sm:block overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={material.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────

export default function MaterialsPage() {
  const { student } = useStudentAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [completions, setCompletions] = useState<MaterialCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [search, setSearch] = useState("");

  async function load() {
    if (!student?.grade || !student?.id) return;
    const [mats, comps] = await Promise.all([
      getMaterialsByGrade(student.grade),
      getMaterialCompletions(student.id, student.grade),
    ]);
    setMaterials(mats);
    setCompletions(comps);
    setLoading(false);
  }

  useEffect(() => { load(); }, [student]);

  async function handleToggleComplete(material: LearningMaterial) {
    if (!student?.id || toggling) return;
    setToggling(material.id!);
    try {
      if (isMaterialCompleted(completions, material.id!)) {
        await unmarkMaterialComplete(student.id, material.id!);
        setCompletions((prev) => prev.filter((c) => c.materialId !== material.id));
      } else {
        await markMaterialComplete(student.id, material);
        setCompletions((prev) => [...prev, {
          studentId: student.id!,
          materialId: material.id!,
          grade: material.grade,
          subject: material.subject,
        }]);
      }
    } finally {
      setToggling(null);
    }
  }

  const subjects = ["all", ...Array.from(new Set(materials.map((m) => m.subject))).sort()];
  const filtered = materials.filter((m) => {
    const sMatch = selectedSubject === "all" || m.subject === selectedSubject;
    const qMatch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    return sMatch && qMatch;
  });

  // Progress stats
  const totalCount = materials.length;
  const completedCount = materials.filter((m) => isMaterialCompleted(completions, m.id!)).length;
  const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalMins = materials.reduce((sum, m) => sum + (m.estimatedMinutes ?? 0), 0);
  const doneMins = materials
    .filter((m) => isMaterialCompleted(completions, m.id!))
    .reduce((sum, m) => sum + (m.estimatedMinutes ?? 0), 0);
  const leftMins = totalMins - doneMins;

  // A material is locked if the one before it (by order) is not yet complete
  function isLocked(index: number): boolean {
    if (index === 0) return false;
    const prev = filtered[index - 1];
    return !isMaterialCompleted(completions, prev.id!);
  }

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Materials</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Grade {student?.grade} · Complete each material in order to unlock the next
          </p>
        </div>

        {/* Progress bar */}
        {!loading && totalCount > 0 && (
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  Your Progress — {completedCount} of {totalCount} completed
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {leftMins > 0
                    ? `About ${formatTime(leftMins)} of content remaining`
                    : totalCount > 0
                      ? "All materials completed! 🎉"
                      : ""}
                </p>
              </div>
              <span className="text-2xl font-black text-secondary-color">{completedPct}%</span>
            </div>
            <div className="h-3 bg-gray-100 w-full">
              <div
                className="h-full bg-secondary-color transition-all duration-500"
                style={{ width: `${completedPct}%` }}
              />
            </div>
            {/* Subject breakdown */}
            {subjects.filter((s) => s !== "all").length > 1 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {subjects.filter((s) => s !== "all").map((subj) => {
                  const subjMats = materials.filter((m) => m.subject === subj);
                  const subjDone = subjMats.filter((m) => isMaterialCompleted(completions, m.id!)).length;
                  const pct = subjMats.length > 0 ? Math.round((subjDone / subjMats.length) * 100) : 0;
                  return (
                    <div key={subj} className="text-xs">
                      <span className="text-gray-500">{subj}: </span>
                      <span className="font-semibold text-gray-800">{subjDone}/{subjMats.length}</span>
                      <span className="text-gray-400 ml-1">({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-44">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials…"
              className="w-full border border-gray-200 pl-8 pr-3 py-2 text-sm outline-none focus:border-secondary-color"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList size={15} className="text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-200 px-3 py-2 text-sm outline-none focus:border-secondary-color"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Subjects" : s}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Materials list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 p-16 text-center">
            <MdMenuBook size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No materials available yet.</p>
            <p className="text-gray-400 text-sm mt-1">Your teacher will add resources here soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m, index) => (
              <MaterialCard
                key={m.id}
                material={m}
                index={index}
                isCompleted={isMaterialCompleted(completions, m.id!)}
                isLocked={isLocked(index)}
                onToggleComplete={handleToggleComplete}
                toggling={toggling === m.id}
              />
            ))}
          </div>
        )}

        {/* All done celebration */}
        {!loading && completedCount > 0 && completedCount === totalCount && (
          <div className="bg-emerald-50 border border-emerald-300 p-5 text-center">
            <p className="text-emerald-700 font-bold text-lg">🎉 You&apos;ve completed all materials!</p>
            <p className="text-emerald-600 text-sm mt-1">
              Check the Tests &amp; Assignments sections for assessments.
            </p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
