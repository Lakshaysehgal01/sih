import { axiosInstance } from "@/lib/axios";
import { config } from "@/lib/wagmi";
import { ABI } from "@/utils/ABI";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

interface FilePreview {
  name: string;
  size: number;
  isImage: boolean;
  isPdf: boolean;
  isDoc: boolean;
  url?: string;
}

type ActiveSection = "dashboard" | "upload" | "verify" | "contact";
type FacingMode = "user" | "environment";
// Add a simple verify mode
// photo: show camera, pdf: show pdf upload/preview

const Dashboard = () => {
  const [active, setActive] = useState<ActiveSection>("dashboard");
  // Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { writeContractAsync } = useWriteContract();

  // Camera state for Verify section
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [facingMode, setFacingMode] = useState<FacingMode>("user"); // "user" for front, "environment" for back
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Verify mode state and PDF helpers
  const [verifyMode, setVerifyMode] = useState<"photo" | "pdf">("photo");
  const verifyPdfInputRef = useRef<HTMLInputElement>(null);
  const [verifyPdfUrl, setVerifyPdfUrl] = useState<string | null>(null);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      // Revoke all object URLs on unmount
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const btnClass = (key: ActiveSection): string =>
    `w-full text-left px-3 py-2 rounded-lg transition ${
      active === key
        ? "bg-white/10 text-slate-100"
        : "hover:bg-white/5 text-slate-300"
    }`;

  // Handlers for file selection/drop and upload
  const handlePickedFiles = (fileList: FileList | null): void => {
    const arr = Array.from(fileList || []).filter(Boolean);
    if (!arr.length) return;

    // Add to existing files instead of replacing
    const newFiles = [...files, ...arr];
    setFiles(newFiles);
    setMessage("");

    // cleanup old previews
    previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));

    // Generate previews for all files
    const allPreviews = newFiles.map((f) => {
      const isImage = f.type?.startsWith("image/");
      const isPdf = f.type === "application/pdf";
      const isDoc = Boolean(
        f.type?.includes("document") || f.name?.match(/\.(doc|docx)$/i)
      );

      return {
        name: f.name,
        size: f.size,
        isImage,
        isPdf,
        isDoc,
        url: isImage || isPdf ? URL.createObjectURL(f) : undefined,
      };
    });
    setPreviews(allPreviews);
  };

  const removeFile = (index: number): void => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // cleanup preview URL for the removed file
    if (previews[index]?.url) {
      URL.revokeObjectURL(previews[index].url);
    }

    // Regenerate previews for all remaining files
    const newPreviews = newFiles.map((f) => {
      const isImage = f.type?.startsWith("image/");
      const isPdf = f.type === "application/pdf";
      const isDoc = Boolean(
        f.type?.includes("document") || f.name?.match(/\.(doc|docx)$/i)
      );

      return {
        name: f.name,
        size: f.size,
        isImage,
        isPdf,
        isDoc,
        url: isImage || isPdf ? URL.createObjectURL(f) : undefined,
      };
    });
    setPreviews(newPreviews);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files?.length) return;
    handlePickedFiles(e.target.files);
    // Reset the input value so the same files can be selected again
    setTimeout(() => {
      if (e.target) e.target.value = "";
    }, 100);
  };

  // PDF change handler for Verify section
  const handleVerifyPdfChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCameraError("Please select a PDF file.");
      return;
    }
    if (verifyPdfUrl) URL.revokeObjectURL(verifyPdfUrl);
    const url = URL.createObjectURL(file);
    setVerifyPdfUrl(url);
  };

  // Switch verify mode and cleanup appropriately
  const handleVerifyModeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const mode = (e.target.value as "photo" | "pdf") || "photo";
    setVerifyMode(mode);
    if (mode === "pdf") {
      // Ensure camera is off when switching to pdf
      stopCamera();
      setCapturedPhoto(null);
    } else {
      // Clear any selected PDF when switching back to photo (optional)
      if (verifyPdfUrl) URL.revokeObjectURL(verifyPdfUrl);
      setVerifyPdfUrl(null);
    }
  };

  // Cleanup pdf object URL
  useEffect(() => {
    return () => {
      if (verifyPdfUrl) URL.revokeObjectURL(verifyPdfUrl);
    };
  }, [verifyPdfUrl]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    handlePickedFiles(e.dataTransfer?.files);
  };

  const handleUpload = async (e: React.FormEvent): Promise<void> => {
    if (!files.length) return;
    setUploading(true);
    setMessage("");
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("pdf", files[0]);
      formData.append("name", "Lakshay13");
      formData.append("rollNo", "0461");
      formData.append("course", "btech");
      formData.append("year", "2027");
      formData.append("university", "Msit");
      const { data } = await axiosInstance.post("/university/issue", formData);
      console.log(data);
      const res = await writeContractAsync({
        address: import.meta.env.VITE_CONTARCT_ADDRESS,
        abi: ABI,
        functionName: "issueDocument",
        args: [data.certHash, data.pdfUrl],
      });
      console.log(res);
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: res,
      });
      console.log(transactionReceipt);
      const { data: final } = await axiosInstance.post(
        "/university/finialize",
        {
          pdfUrl: data.pdfUrl,
          certHash: data.certHash,
        }
      );
      console.log(final);
      // console.log("Final PDF with QR:", final.finalPdfUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      console.error("error");
      setMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  // Camera functions for Verify section
  const startCamera = async (mode: FacingMode = facingMode): Promise<void> => {
    try {
      setCameraError("");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: mode,
        },
        audio: false,
      });

      setCameraStream(stream);

      // Wait for next tick to ensure state is updated
      setTimeout(() => {
        if (videoRef.current && stream) {
          console.log("Setting video source");
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded, attempting to play");
            videoRef.current
              ?.play()
              .then(() => console.log("Video playing successfully"))
              .catch((e) => console.error("Play failed:", e));
          };
        }
      }, 100);
    } catch (err: unknown) {
      console.error("Camera error:", err);
      let errorMessage = "Camera access failed. ";
      const e = err as { name?: string; message?: string };

      if (e?.name === "NotAllowedError") {
        errorMessage += "Please allow camera permissions.";
      } else if (e?.name === "NotFoundError") {
        errorMessage += "No camera found.";
      } else if (e?.name === "NotSupportedError") {
        errorMessage += "Camera not supported.";
      } else {
        errorMessage += e?.message || "Unknown error.";
      }

      setCameraError(errorMessage);
    }
  };

  const stopCamera = (): void => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = (): void => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref not available");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video not ready yet");
      setCameraError("Video not ready. Please wait a moment and try again.");
      return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);

    const photoDataURL = canvas.toDataURL("image/jpeg", 0.9);
    console.log(
      "Photo captured successfully",
      photoDataURL.substring(0, 50) + "..."
    );
    setCapturedPhoto(photoDataURL);

    // Keep camera stream running for retake functionality
    // Don't stop the camera, just hide the video element
  };

  const retakePhoto = (): void => {
    setCapturedPhoto(null);
    // Always ensure camera is running after retake
    if (cameraStream && videoRef.current) {
      // Camera stream exists, reconnect video element
      videoRef.current.srcObject = cameraStream;
      // Force the video to play
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error);
        }
      }, 50);
    } else {
      // No camera stream, start fresh
      startCamera();
    }
  };

  const switchCamera = (): void => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";

    // Stop current stream and restart with new camera
    if (cameraStream) {
      stopCamera();
      setTimeout(() => {
        // Set the new facing mode and restart camera with new mode
        setFacingMode(newFacingMode);
        startCamera(newFacingMode); // Pass the new mode directly
      }, 100);
    } else {
      // If no stream, just update the facing mode
      setFacingMode(newFacingMode);
    }
  };

  // Cleanup camera on unmount or section change
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Stop camera when switching away from verify section
  useEffect(() => {
    if (active !== "verify") {
      stopCamera();
      setCapturedPhoto(null);
      setCameraError("");
    }
  }, [active]);

  return (
    <div
      className={`min-h-screen bg-[#0b0f1a] text-slate-200 flex ${
        sidebarOpen ? "pl-64" : ""
      } lg:pl-64`}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`
        w-64 h-screen shrink-0 border-r border-white/10 bg-[#0d1220] flex flex-col
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
         ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="px-6 py-4 flex items-center gap-2 border-b border-white/10">
          <div className="w-6 h-6 rounded bg-white/10" />
          <span className="font-semibold tracking-wide">findly</span>
          <span className="ml-2 text-[10px] text-slate-400 px-2 py-0.5 rounded-full border border-white/10">
            Beta
          </span>
          {/* Mobile close */}
          <button
            className="ml-auto lg:hidden p-2 text-slate-400 hover:text-slate-200"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#30354d] scrollbar-track-transparent scrollbar-thumb-rounded-full">
          <button
            onClick={() => {
              setActive("dashboard");
              setSidebarOpen(false);
            }}
            className={btnClass("dashboard")}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActive("upload");
              setSidebarOpen(false);
            }}
            className={`${btnClass("upload")} mt-1`}
          >
            Issue Documents
          </button>
          <button
            onClick={() => {
              setActive("verify");
              setSidebarOpen(false);
            }}
            className={`${btnClass("verify")} mt-1`}
          >
            Verify
          </button>
          <button
            onClick={() => {
              setActive("contact");
              setSidebarOpen(false);
            }}
            className={`${btnClass("contact")} mt-1`}
          >
            Contact Us
          </button>
        </nav>
        <div className="p-3 border-t border-white/10">
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300">
            Feedback
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 mt-1">
            Usage
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 mt-1">
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="w-full flex-1 flex flex-col">
        {/* Top bar / breadcrumb */}
        <header className="h-12 flex items-center border-b border-white/10 px-6">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            className="lg:hidden p-2 mr-3 text-slate-400 hover:text-slate-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-slate-400 text-sm">
            Demo <span className="mx-1">/</span>{" "}
            <span className="text-slate-200">Assistant</span>
          </div>
        </header>

        {/* Content area */}
        <section className="md:w-full flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5 scrollbar-thin scrollbar-thumb-[#30354d] scrollbar-track-transparent scrollbar-thumb-rounded-full">
          {/* Dashboard Section */}
          {active === "dashboard" && (
            <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4 md:p-5">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="min-w-0 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center gap-2 text-slate-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-medium truncate">
                      Average engagement rate per month
                    </span>
                    <button className="text-slate-400 hover:text-slate-200 text-xs">
                      ✎
                    </button>
                    <button className="text-slate-300 hover:text-slate-100 text-xs px-2 py-1 rounded-md border border-white/10">
                      Add tag
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/10" />
                    <span className="truncate">joaquin+demo@findly.ai</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="text-xs sm:text-sm">
                      19 December, 13:27
                    </span>
                  </div>
                  <div className="mt-3 text-slate-100">
                    Average engagement rate per month
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:shrink-0">
                  <button className="px-3 py-1.5 text-xs rounded-full bg-[#0e2b5f] text-blue-300 border border-blue-500/30">
                    Update
                  </button>
                  <button className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-slate-300 bg-white/5">
                    Export Summary
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-200">
                    ☆
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-300">
                    🗑
                  </button>
                </div>
              </div>

              {/* Status card */}
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px]">
                    F
                  </div>
                  <span className="font-medium">Findly</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-white/10 px-3 py-2 bg-white/[0.02]">
                    <div className="text-slate-200 text-sm">Pre-processing</div>
                    <div className="text-[11px] text-slate-400">
                      Finished at 12/19/2023, 1:28:02 PM
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 px-3 py-2 bg-white/[0.02]">
                    <div className="text-slate-200 text-sm">
                      Generating metadata
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[11px] text-amber-300/80">
                  Results from GA4 - Findly, 19 December 13:27
                </div>
              </div>
            </div>
          )}

          {/* Upload Section */}
          {active === "upload" && (
            <div className="bg-white/[0.03] rounded-xl p-4 md:p-6">
              <div className="text-lg font-medium text-slate-100 mb-5">
                Upload
              </div>

              {/* Hidden multi file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Dropzone / Preview area */}
              <div
                className="w-full h-[300px] sm:h-[350px] rounded-xl border border-white/10 bg-white/[0.02] mb-6 flex items-center justify-center text-center px-4 cursor-pointer overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {previews.length ? (
                  <div
                    className="w-full h-full overflow-auto p-2 sm:p-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {previews.map((p, idx) => (
                      <div key={idx} className="relative group">
                        {p.isImage ? (
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-32 object-cover rounded-lg border border-white/10 bg-white/5"
                          />
                        ) : p.isPdf ? (
                          <div className="h-32 rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
                            <embed
                              src={p.url}
                              type="application/pdf"
                              className="w-full h-full pointer-events-none"
                            />
                          </div>
                        ) : (
                          <div className="h-32 rounded-lg border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center px-2">
                            <div className="text-2xl mb-2">
                              {p.isDoc ? "📄" : "📁"}
                            </div>
                            <div className="text-xs font-medium text-slate-200 truncate w-full text-center">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {Math.round(p.size / 1024)} KB
                            </div>
                          </div>
                        )}
                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {/* Add more files button */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="h-32 rounded-lg border-2 border-dashed border-white/20 bg-white/[0.01] flex items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="text-center text-slate-400">
                        <div className="text-2xl mb-1">+</div>
                        <div className="text-xs">Add more</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <div className="font-medium">Drag & drop files here</div>
                    <div className="text-xs mt-1">
                      or click to browse (Images / PDF / DOCX) — multiple
                      supported
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="w-full h-[80px] rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                >
                  {files.length
                    ? `Change files (${files.length})`
                    : "Choose Images/PDF/DOCX"}
                </button>
                <button
                  onClick={(e) => {
                    handleUpload(e);
                  }}
                  disabled={!files.length || uploading}
                  className="px-4 py-2 rounded-lg bg-[#0e2b5f] text-blue-300 border border-blue-500/30 disabled:opacity-50"
                >
                  {uploading
                    ? "Uploading..."
                    : `Upload${files.length ? ` (${files.length})` : ""}`}
                </button>
              </div>
              {message && (
                <div className="text-xs text-slate-400 mt-2">{message}</div>
              )}
            </div>
          )}

          {/* Verify Section */}
          {active === "verify" && (
            <div className="bg-white/[0.03] rounded-xl p-6 flex flex-col">
              <div className="text-lg font-medium text-slate-100 mb-5">
                Identity Verification
              </div>

              {cameraError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                  {cameraError}
                </div>
              )}

              {/* Mode selector */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label className="text-sm font-semibold text-slate-300">
                  Mode
                </label>
                <select
                  value={verifyMode}
                  onChange={handleVerifyModeChange}
                  className="w-full sm:w-auto bg-[#0d1220] border border-white/20 rounded-md px-3 py-2 text-sm !text-white font-semibold"
                >
                  <option className="text-white" value="photo">
                    Click a photo
                  </option>
                  <option className="text-white" value="pdf">
                    Scan a PDF
                  </option>
                </select>
              </div>

              {/* Photo Mode */}
              {verifyMode === "photo" && (
                <div className="flex flex-col gap-6">
                  {/* Camera/Preview Area */}
                  <div className="space-y-4">
                    <div className="relative w-full aspect-[3/4] sm:aspect-video rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                      {capturedPhoto ? (
                        <img
                          src={capturedPhoto}
                          alt="Captured photo"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : cameraStream ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="absolute inset-0 w-full h-full object-cover"
                          onLoadedMetadata={() => {
                            if (videoRef.current) {
                              videoRef.current.play().catch(console.error);
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-400">
                          <div className="text-center px-4">
                            <div className="text-4xl mb-3">📷</div>
                            <div className="font-medium">Camera Preview</div>
                            <div className="text-xs mt-1">
                              Click "Start Camera" to begin
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Camera Controls */}
                    <div className="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-2 sm:gap-3">
                      {!cameraStream && !capturedPhoto && (
                        <button
                          onClick={() => startCamera()}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0e2b5f] text-blue-300 border border-blue-500/30 hover:bg-[#0e2b5f]/80 text-sm"
                        >
                          Start Camera
                        </button>
                      )}

                      {cameraStream && !capturedPhoto && (
                        <>
                          <button
                            onClick={capturePhoto}
                            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                          >
                            📸 Capture
                          </button>
                          <button
                            onClick={switchCamera}
                            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm"
                            title="Switch Camera"
                          >
                            🔄 {facingMode === "user" ? "Back" : "Front"}
                          </button>
                          <button
                            onClick={stopCamera}
                            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm"
                          >
                            Stop
                          </button>
                        </>
                      )}

                      {capturedPhoto && (
                        <>
                          <button
                            onClick={retakePhoto}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm"
                          >
                            Retake
                          </button>
                          <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0e2b5f] text-blue-300 border border-blue-500/30 hover:bg-[#0e2b5f]/80 text-sm">
                            Use Photo
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Mode */}
              {verifyMode === "pdf" && (
                <div className="flex flex-col gap-4">
                  <input
                    ref={verifyPdfInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleVerifyPdfChange}
                    className="hidden"
                  />
                  <div className="relative w-full aspect-[3/4] sm:aspect-video rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex items-center justify-center">
                    {verifyPdfUrl ? (
                      <embed
                        src={verifyPdfUrl}
                        type="application/pdf"
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <div className="text-slate-400 text-center px-4">
                        <div className="text-4xl mb-3">📄</div>
                        <div className="font-medium">Scan a PDF</div>
                        <div className="text-xs mt-1">
                          Choose a PDF to preview and scan
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-2 sm:gap-3">
                    <button
                      onClick={() => verifyPdfInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0e2b5f] text-blue-300 border border-blue-500/30 hover:bg-[#0e2b5f]/80 text-sm"
                    >
                      Choose PDF
                    </button>
                    {verifyPdfUrl && (
                      <>
                        <a
                          href={verifyPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm text-center"
                        >
                          Open in new tab
                        </a>
                        <button
                          onClick={() => {
                            if (verifyPdfUrl) URL.revokeObjectURL(verifyPdfUrl);
                            setVerifyPdfUrl(null);
                          }}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm"
                        >
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Hidden canvas for photo capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Contact Section */}
          {active === "contact" && (
            <div className="bg-white/[0.03] rounded-xl p-6">
              <div className="text-lg font-medium text-slate-100 mb-3">
                Contact Us
              </div>
              <div className="h-56 rounded-lg border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-400">
                Contact content
              </div>
            </div>
          )}
        </section>

        {/* Sticky footer */}
        <footer className="h-14 border-t border-white/10 px-6 flex items-center justify-between bg-[#0b0f1a]/80 backdrop-blur">
          <div className="text-xs text-slate-400">GA4 - Findly</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-slate-300 bg-white/5">
              New conversation
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
