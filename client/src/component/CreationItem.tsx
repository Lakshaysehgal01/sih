import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Download, ChevronDown } from "lucide-react";

// Minimal type describing the document data you provided
export interface CreationDocument {
  _id: string;
  name: string;
  enrollNo: string;
  course: string;
  year: string;
  type: "pdf" | "png" | "jpg" | string;
  QrLink: string;
  certHash: string;
  issued: boolean;
  issuedBy?: { _id: string; universityName?: string; email?: string } | string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(d?: string) {
  try {
    return d ? new Date(d).toLocaleString() : "-";
  } catch {
    return d || "-";
  }
}

export default function CreationItem({ item }: { item: CreationDocument }) {
  const [expand, setExpand] = useState<boolean>(false);

  const copy = async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Copy failed");
    }
  };

  const issuedByObj =
    item && typeof item.issuedBy === "object" ? item.issuedBy : undefined;

  return (
    <div
      className="p-4 w-full text-sm bg-white/[0.02] border border-white/10 rounded-lg cursor-pointer hover:bg-white/[0.04] transition"
      onClick={() => setExpand((v) => !v)}
      role="button"
      aria-expanded={expand}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2
            className="text-slate-100 font-semibold truncate"
            title={item.name}
          >
            {item.name}
          </h2>
          <p className="text-slate-400 truncate">
            {item.course} • {item.year} • Enroll: {item.enrollNo}
          </p>
          <p className="text-slate-500 text-md">
            Created: {formatDate(item.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-md font-medium border ${
              item.issued
                ? "bg-green-500/15 text-green-300 border-green-500/30"
                : "bg-yellow-500/15 text-red-300 border-yellow-500/30"
            }`}
          >
            {item.issued ? "Issued" : "Rejected"}
          </span>
          <span className="px-3 py-1 rounded-full text-md font-medium border border-white/10 text-slate-300">
            {String(item.type).toUpperCase()}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              expand ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expand && (
        <div
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left column */}
          <div className="space-y-3">
            <div>
              <div className="text-md text-slate-400">Certificate Hash</div>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-md break-all text-slate-200">
                  {item.certHash}
                </code>
                <button
                  onClick={() => copy(item.certHash, "Hash copied")}
                  className="p-1 rounded border border-white/10 hover:bg-white/[0.06]"
                  title="Copy cert hash"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-md text-slate-400">Name</div>
                <div
                  className="mt-0.5 text-slate-200 truncate"
                  title={item.name}
                >
                  {item.name}
                </div>
              </div>
              <div>
                <div className="text-md text-slate-400">Enroll No</div>
                <div className="mt-0.5 text-slate-200 truncate">
                  {item.enrollNo}
                </div>
              </div>
              <div>
                <div className="text-md text-slate-400">Course</div>
                <div className="mt-0.5 text-slate-200 truncate">
                  {item.course}
                </div>
              </div>
              <div>
                <div className="text-md text-slate-400">Year</div>
                <div className="mt-0.5 text-slate-200 truncate">
                  {item.year}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-3">
            <div>
              <div className="text-md text-slate-400">QR/Document Link</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <a
                  href={item.QrLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-violet-500/30 bg-[#1e152e] text-violet-300 hover:bg-[#2c223c] text-md"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
                <a
                  href={item.QrLink}
                  download
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-md"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <button
                  onClick={() => copy(item.QrLink, "Link copied")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-md"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Link
                </button>
              </div>
            </div>

            <div>
              <div className="text-md text-slate-400">Issued By</div>
              {issuedByObj ? (
                <div className="mt-0.5 text-slate-200">
                  <div className="truncate" title={issuedByObj.universityName}>
                    {issuedByObj.universityName || "-"}
                  </div>
                  <div
                    className="text-slate-400 text-md truncate"
                    title={issuedByObj.email}
                  >
                    {issuedByObj.email || "-"}
                  </div>
                </div>
              ) : (
                <div className="mt-0.5 text-slate-400">-</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-md text-slate-400">
              <div>
                <div className="text-md">Created</div>
                <div className="text-slate-300">
                  {formatDate(item.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-md">Updated</div>
                <div className="text-slate-300">
                  {formatDate(item.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
