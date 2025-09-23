import { Loader2 } from "lucide-react";

type ScreenLoaderProps = {
  show: boolean;
  text?: string;
  subText?: string;
};

export default function ScreenLoader({
  show = false,
  text = "Loading...",
  subText = "Please wait while we load your content.",
}: ScreenLoaderProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        role="alert"
        aria-busy="true"
        className="relative mx-4 w-full max-w-sm rounded-xl border border-white/10 bg-[#0b0a13] p-6 text-center shadow-xl"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
          <Loader2 className="h-6 w-6 animate-spin text-violet-300" />
        </div>
        <div className="text-slate-100 font-semibold">{text}</div>
        {subText ? (
          <div className="mt-1 text-sm text-slate-400">{subText}</div>
        ) : null}
      </div>
    </div>
  );
}
