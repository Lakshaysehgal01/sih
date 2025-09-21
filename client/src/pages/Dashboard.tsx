import { axiosInstance } from "@/lib/axios";
import { config } from "@/lib/wagmi";
import { ABI } from "@/utils/ABI";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useNavigate } from "react-router-dom";
import ReasonModal from "@/component/ReasonModal";
import { toast } from "sonner";
import axios from "axios";

interface FilePreview {
  name: string;
  size: number;
  isImage: boolean;
  isPdf: boolean;
  isDoc: boolean;
  url?: string;
}

type ActiveSection =
  | "dashboard"
  | "upload"
  | "verify"
  | "contact"
  | "pending-requests";
type FacingMode = "user" | "environment";

const Dashboard = () => {
  const [active, setActive] = useState<ActiveSection>("dashboard");
  // Upload state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { writeContractAsync } = useWriteContract();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

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
  const [verifyPdfFiles, setVerifyPdfFiles] = useState<File[]>([]);
  const [verifyPdfPreviews, setVerifyPdfPreviews] = useState<string[]>([]);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verifyResults, setVerifyResults] = useState<any[]>([]);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
  const [requestsError, setRequestsError] = useState<string>("");
  const [reasonModalOpen, setReasonModalOpen] = useState<boolean>(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (role === "admin") {
      fetchPendingRequests();
    }
  }, [role]); // This will run when role changes

  const fetchPendingRequests = async () => {
    setLoadingRequests(true);
    setRequestsError("");

    try {
      const response = await axiosInstance.get("/admin/getAllPendingRequests", {
        withCredentials: true,
      });

      // Handle the response structure based on your controller
      if (response.data.data) {
        setPendingRequests(response.data.data);
      } else if (Array.isArray(response.data)) {
        setPendingRequests(response.data);
      } else {
        setPendingRequests([]);
      }
    } catch (error: any) {
      console.error("❌ Failed to fetch pending requests:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        data: error.response?.data,
      });

      setRequestsError(
        error.response?.data?.message || "Failed to fetch pending requests"
      );
      setPendingRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Handle approve university request
  const handleApproveRequest = async (requestId: string) => {
    try {
      const response = await axiosInstance.post(
        `/admin/accept/${requestId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("University approved successfully!");
        // Refresh the pending requests list
        fetchPendingRequests();
      }
    } catch (error: any) {
      console.error("Failed to approve request:", error);
      toast.error(
        error.response?.data?.message || "Failed to approve university request"
      );
    }
  };

  // Handle reject university request - updated to work with modal
  const handleRejectRequest = async (reason: string) => {
    if (!selectedRequestId) return;

    setRejectLoading(true);
    try {
      const response = await axiosInstance.post(
        `/admin/reject/${selectedRequestId}`,
        { reason },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("University request rejected successfully!");
        // Refresh the pending requests list
        fetchPendingRequests();
        // Close modal and reset state
        setReasonModalOpen(false);
        setSelectedRequestId(null);
      }
    } catch (error: any) {
      console.error("Failed to reject request:", error);
      toast.error(
        error.response?.data?.message || "Failed to reject university request"
      );
    } finally {
      setRejectLoading(false);
    }
  };

  // Handle opening reject modal
  const handleOpenRejectModal = (requestId: string) => {
    setSelectedRequestId(requestId);
    setReasonModalOpen(true);
  };

  // Handle closing reject modal
  const handleCloseRejectModal = () => {
    setReasonModalOpen(false);
    setSelectedRequestId(null);
  };

  // Handle view letter
  const handleViewLetter = (letterUrl: string) => {
    if (letterUrl) {
      window.open(letterUrl, "_blank");
    } else {
      toast.error("No letter available for this request");
    }
  };

  async function getUserDetails(): Promise<string> {
    try {
      const response = await axiosInstance.get("/auth/api/me", {
        withCredentials: true,
      });

      // axiosInstance already handles the response parsing
      if (response.status === 200 && response.data) {
        const userRole =
          response.data.user?.role || response.data.role || "user";
        return userRole;
      }

      throw new Error("Invalid response format");
    } catch (error: any) {
      console.error("❌ Failed to get user details:", error);
      console.error("❌ User details error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        data: error.response?.data,
      });

      if (error.response?.status === 401) {
        navigate("/signin");
      }

      throw new Error(error.response?.data?.message || "Not authorized");
    }
  }

  // Call getUserDetails when component mounts
  useEffect(() => {
    getUserDetails()
      .then((role: string) => {
        setRole(role);
      })
      .catch((error) => {
        console.error("❌ Authentication error:", error);
        // Handle error state if needed
      });
  }, []);

  useEffect(() => {
    return () => {
      // Revoke all object URLs on unmount
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const btnClass = (key: ActiveSection): string =>
    `w-full text-left px-3 py-2 rounded-lg transition ${
      active === key
        ? "bg-violet-500/20 text-violet-200 border border-violet-500/30"
        : "hover:bg-white/5 text-slate-300 hover:text-slate-200"
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

  // PDF change handler for Verify section - now supports multiple files
  const handleVerifyPdfChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Filter only PDF files
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== files.length) {
      setCameraError("Please select only PDF files.");
      return;
    }

    // Clean up existing previews
    verifyPdfPreviews.forEach((url) => URL.revokeObjectURL(url));

    // Create new previews
    const newPreviews = pdfFiles.map((file) => URL.createObjectURL(file));

    setVerifyPdfFiles([...verifyPdfFiles, ...pdfFiles]);
    setVerifyPdfPreviews([...verifyPdfPreviews, ...newPreviews]);
    setVerifyResults([]); // Clear previous results
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
      // Clear any selected PDFs when switching back to photo
      verifyPdfPreviews.forEach((url) => URL.revokeObjectURL(url));
      setVerifyPdfFiles([]);
      setVerifyPdfPreviews([]);
      setVerifyResults([]);
    }
  };

  // Handle multiple PDF verification submission
  const handleVerifyPdfSubmit = async (): Promise<void> => {
    if (!verifyPdfFiles.length) {
      toast.error("Please select at least one PDF file first");
      return;
    }

    setVerifyLoading(true);
    setVerifyResults([]);
    setLoading(true);

    try {
      const formData = new FormData();

      // ✅ Append all files under the same key
      verifyPdfFiles.forEach((file) => {
        formData.append("files", file);
      });

      // ✅ Send one POST with all files
      const response = await axios.post(
        "https://certificate-verifier-v1-1.onrender.com/upload-certificates/",
        formData
      );

      console.log("Verification response", response.data);

      toast.success(response?.data?.message);
      setVerifyResults(response.data);

      setTimeout(async () => {
        try {
          const session_id = response?.data?.session_id;
          const uploadResult = await axios.get(
            `https://certificate-verifier-v1-1.onrender.com/results/${session_id}`
          );
          console.log("Upload result", uploadResult.data);
        } catch (err) {
          console.error("Failed to fetch detailed results:", err);
          setLoading(false);
        }
      }, 30000);

      setLoading(false);

      // --- Summary toast ---
    } catch (error: any) {
      console.error("Failed to verify documents:", error);
      toast.error("Failed to verify documents");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Remove a specific PDF file
  const removeVerifyPdf = (index: number): void => {
    const newFiles = verifyPdfFiles.filter((_, i) => i !== index);
    const newPreviews = verifyPdfPreviews.filter((_, i) => i !== index);

    // Clean up the removed preview
    if (verifyPdfPreviews[index]) {
      URL.revokeObjectURL(verifyPdfPreviews[index]);
    }

    setVerifyPdfFiles(newFiles);
    setVerifyPdfPreviews(newPreviews);

    // Clear results if no files left
    if (newFiles.length === 0) {
      setVerifyResults([]);
    }
  };

  // Cleanup PDF object URLs
  useEffect(() => {
    return () => {
      verifyPdfPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [verifyPdfPreviews]);

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

      const res = await writeContractAsync({
        address: import.meta.env.VITE_CONTARCT_ADDRESS,
        abi: ABI,

        functionName: "issueDocument",
        args: [data.certHash, data.pdfUrl],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: res,
      });
      const { data: final } = await axiosInstance.post(
        "/university/finialize",
        {
          pdfUrl: data.pdfUrl,
          certHash: data.certHash,
        }
      );
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
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
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
      className={`min-h-screen bg-[#0a0a10] text-slate-200 flex ${
        sidebarOpen ? "pl-64" : ""
      } lg:pl-64`}
      style={{
        background: `linear-gradient(135deg, #0a0a10 0%, #15042c 100%)`,
      }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ReasonModal for rejecting requests */}
      <ReasonModal
        isOpen={reasonModalOpen}
        onClose={handleCloseRejectModal}
        onSubmit={handleRejectRequest}
        loading={rejectLoading}
      />

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={`
        w-64 h-screen shrink-0 border-r border-white/10 bg-[#080412] flex flex-col
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
         ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="px-6 py-4 flex items-center gap-2 border-b border-white/10">
          <div className="w-6 h-6 rounded bg-white/10" />
          <span className="font-semibold tracking-wide">VeriFy</span>
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
          {(role === "university" || role === "admin") && (
            <button
              onClick={() => {
                setActive("upload");
                setSidebarOpen(false);
              }}
              className={btnClass("upload")}
            >
              Issue Documents
            </button>
          )}
          <button
            onClick={() => {
              setActive("verify");
              setSidebarOpen(false);
            }}
            className={`${btnClass("verify")} mt-1`}
          >
            Verify
          </button>

          {/* Admin-only Pending Requests */}
          {role === "admin" && (
            <button
              onClick={() => {
                setActive("pending-requests");
                setSidebarOpen(false);
                // Always fetch requests when clicking the button, regardless of current state
                fetchPendingRequests();
              }}
              className={`${btnClass("pending-requests")} mt-1`}
            >
              Pending Requests
              {/* You can add a badge here for count */}
              <span className="ml-2 px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                Admin
              </span>
            </button>
          )}

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
        <header className="h-12 flex items-center border-b border-white/10 px-6 py-7">
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
          <div className="text-slate-400 text-md font-semibold">Dashboard</div>
        </header>

        {/* Content area */}
        <section className="md:w-full flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5 scrollbar-thin scrollbar-thumb-[#30354d] scrollbar-track-transparent scrollbar-thumb-rounded-full">
          {/* Dashboard Section */}
          {active === "dashboard" && (
            <div className="bg-violet-500/[0.05] rounded-xl border border-violet-500/20 p-4 md:p-5 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                <div className="min-w-0 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center gap-2 text-slate-300">
                    <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
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
                  <button className="px-3 py-1.5 text-xs rounded-full bg-[#1e152e] text-violet-300 border border-violet-500/30 hover:bg-[#2c223c] transition-colors">
                    Update
                  </button>
                  <button className="px-3 py-1.5 text-xs rounded-md border border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
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
          {(role === "university" || role === "admin") &&
            active === "upload" && (
              <div className="bg-violet-500/[0.05] rounded-xl border border-violet-500/20 p-4 md:p-6 backdrop-blur-sm">
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
                    className="px-4 py-2 rounded-lg bg-[#1e152e] text-violet-300 border border-violet-500/30 hover:bg-[#2c223c] disabled:opacity-50 transition-colors"
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
            <div className="bg-violet-500/[0.05] rounded-xl border border-violet-500/20 p-6 flex flex-col backdrop-blur-sm">
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
                  className="w-full sm:w-auto bg-[#1e152e] border border-[#2c223c] rounded-md px-3 py-2 text-sm !text-white font-semibold focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  <option className="text-white bg-[#1e152e]" value="photo">
                    Click a photo
                  </option>
                  <option className="text-white bg-[#1e152e]" value="pdf">
                    Upload a PDF
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
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1e152e] text-violet-300 border border-violet-500/30 hover:bg-[#2c223c] text-sm transition-colors"
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
                          <button className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1e152e] text-violet-300 border border-violet-500/30 hover:bg-[#2c223c] text-sm transition-colors">
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
                    multiple
                    onChange={handleVerifyPdfChange}
                    className="hidden"
                  />

                  {/* PDF Preview Area */}
                  {verifyPdfFiles.length > 0 ? (
                    <div className="space-y-4">
                      {/* Selected Files Display */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {verifyPdfFiles.map((file, index) => (
                          <div
                            key={index}
                            className="relative group border border-white/10 rounded-lg p-3 bg-white/[0.02]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">📄</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-200 truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {Math.round(file.size / 1024)} KB
                                </div>
                              </div>
                              <button
                                onClick={() => removeVerifyPdf(index)}
                                disabled={verifyLoading}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* PDF Preview */}
                            {verifyPdfPreviews[index] && (
                              <div className="mt-3 relative aspect-[3/4] rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
                                <embed
                                  src={verifyPdfPreviews[index]}
                                  type="application/pdf"
                                  className="absolute inset-0 w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add More Files Button */}
                        <div
                          onClick={() => verifyPdfInputRef.current?.click()}
                          className="border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-colors min-h-[200px]"
                        >
                          <div className="text-4xl text-slate-400 mb-2">+</div>
                          <div className="text-sm text-slate-400 text-center">
                            Add more PDFs
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[3/4] sm:aspect-video rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden flex items-center justify-center">
                      <div className="text-slate-400 text-center px-4">
                        <div className="text-4xl mb-3">📄</div>
                        <div className="font-medium">Verify Multiple PDFs</div>
                        <div className="text-xs mt-1">
                          Choose one or more PDF files to verify
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PDF Action Buttons */}
                  <div className="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-2 sm:gap-3">
                    <button
                      onClick={() => verifyPdfInputRef.current?.click()}
                      disabled={loading}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1e152e] text-violet-300 border border-violet-500/30 hover:bg-[#2c223c] text-sm disabled:opacity-50 transition-colors"
                    >
                      {verifyPdfFiles.length > 0
                        ? "Add More PDFs"
                        : "Choose PDFs"}
                    </button>
                    {verifyPdfFiles.length > 0 && (
                      <>
                        <button
                          onClick={handleVerifyPdfSubmit}
                          disabled={loading}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          )}
                          {loading
                            ? "Verifying..."
                            : `🔍 Verify ${verifyPdfFiles.length} Document${
                                verifyPdfFiles.length > 1 ? "s" : ""
                              }`}
                        </button>
                        <button
                          onClick={() => {
                            verifyPdfPreviews.forEach((url) =>
                              URL.revokeObjectURL(url)
                            );
                            setVerifyPdfFiles([]);
                            setVerifyPdfPreviews([]);
                            setVerifyResults([]);
                          }}
                          disabled={loading}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 text-sm disabled:opacity-50"
                        >
                          Clear All
                        </button>
                      </>
                    )}
                  </div>

                  {/* Verification Results */}
                  {verifyResults.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-slate-100">
                          Verification Results
                        </h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          {verifyResults.filter((r) => r.isValid).length}/
                          {verifyResults.length} Valid
                        </span>
                      </div>

                      {verifyResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            result.isValid
                              ? "bg-green-500/10 border-green-500/20"
                              : "bg-red-500/10 border-red-500/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 ${
                                result.isValid
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {result.isValid ? (
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={`font-medium ${
                                    result.isValid
                                      ? "text-green-300"
                                      : "text-red-300"
                                  }`}
                                >
                                  {result.fileName}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full ${
                                    result.isValid
                                      ? "bg-green-500/20 text-green-300"
                                      : "bg-red-500/20 text-red-300"
                                  }`}
                                >
                                  {result.isValid ? "Valid" : "Invalid"}
                                </span>
                              </div>
                              <p
                                className={`text-sm ${
                                  result.isValid
                                    ? "text-green-200/80"
                                    : "text-red-200/80"
                                }`}
                              >
                                {result.message ||
                                  result.error ||
                                  "Verification completed"}
                              </p>

                              {/* Show additional details if available */}
                              {result.details && (
                                <div className="mt-2 text-xs space-y-1">
                                  {result.details.universityName && (
                                    <p>
                                      <span className="text-slate-400">
                                        University:
                                      </span>{" "}
                                      {result.details.universityName}
                                    </p>
                                  )}
                                  {result.details.studentName && (
                                    <p>
                                      <span className="text-slate-400">
                                        Student:
                                      </span>{" "}
                                      {result.details.studentName}
                                    </p>
                                  )}
                                  {result.details.course && (
                                    <p>
                                      <span className="text-slate-400">
                                        Course:
                                      </span>{" "}
                                      {result.details.course}
                                    </p>
                                  )}
                                  {result.details.issueDate && (
                                    <p>
                                      <span className="text-slate-400">
                                        Issued:
                                      </span>{" "}
                                      {new Date(
                                        result.details.issueDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hidden canvas for photo capture */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {/* Pending Requests Section (Admin Only) */}
          {active === "pending-requests" && role === "admin" && (
            <div className="bg-violet-500/[0.05] rounded-xl border border-violet-500/20 p-4 md:p-6 backdrop-blur-sm">
              <div className="text-lg font-medium text-slate-100 mb-5 flex items-center gap-3">
                Pending University Requests
                <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                  Admin Panel
                </span>
                {loadingRequests && (
                  <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* Error State */}
              {requestsError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                  {requestsError}
                  <button
                    onClick={fetchPendingRequests}
                    className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Request Cards */}
              <div className="space-y-4">
                {loadingRequests ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.02] border border-white/10 rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                            <div className="h-4 bg-slate-600 rounded w-32"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-slate-700 rounded w-48"></div>
                            <div className="h-3 bg-slate-700 rounded w-32"></div>
                            <div className="h-3 bg-slate-700 rounded w-40"></div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="h-8 bg-slate-600 rounded w-24"></div>
                          <div className="h-8 bg-slate-600 rounded w-20"></div>
                          <div className="h-8 bg-slate-600 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : pendingRequests.length > 0 ? (
                  // Real data
                  pendingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="bg-white/[0.02] border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                            <h3 className="text-slate-100 font-medium">
                              {request.universityName || "Unknown University"}
                            </h3>
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                              Pending
                            </span>
                          </div>

                          <div className="text-sm text-slate-300 space-y-1">
                            <p>
                              <span className="text-slate-400">Email:</span>{" "}
                              {request.email}
                            </p>
                            <p>
                              <span className="text-slate-400">AISHE:</span>{" "}
                              {request.AISHE || "N/A"}
                            </p>
                            <p>
                              <span className="text-slate-400">Address:</span>{" "}
                              {request.publicAddress
                                ? `${request.publicAddress.substring(0, 20)}...`
                                : "N/A"}
                            </p>
                            <p>
                              <span className="text-slate-400">Submitted:</span>{" "}
                              {request.createdAt
                                ? new Date(
                                    request.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
                          <button
                            onClick={() => handleViewLetter(request.letter)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                          >
                            📄 View Letter
                          </button>
                          <button
                            onClick={() => handleApproveRequest(request._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(request._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state
                  <div className="text-center py-12 text-slate-400">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium mb-2">
                      No Pending Requests
                    </h3>
                    <p className="text-sm">
                      All university registration requests have been processed.
                    </p>
                    <button
                      onClick={fetchPendingRequests}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      🔄 Refresh
                    </button>
                  </div>
                )}
              </div>

              {/* Stats Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {loadingRequests ? "..." : pendingRequests.length}
                  </div>
                  <div className="text-sm text-slate-400">Pending</div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">-</div>
                  <div className="text-sm text-slate-400">Approved</div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">-</div>
                  <div className="text-sm text-slate-400">Rejected</div>
                </div>
              </div>

              {/* Manual Refresh Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={fetchPendingRequests}
                  disabled={loadingRequests}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  {loadingRequests ? "🔄 Refreshing..." : "🔄 Refresh Requests"}
                </button>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {active === "contact" && (
            <div className="bg-violet-500/[0.05] rounded-xl border border-violet-500/20 p-6 backdrop-blur-sm">
              <div className="text-lg font-medium text-slate-100 mb-3">
                Contact Us
              </div>
              <div className="h-56 rounded-lg border border-violet-500/20 bg-violet-500/[0.02] flex items-center justify-center text-slate-400">
                Contact content
              </div>
            </div>
          )}
        </section>

        {/* Sticky footer */}
        <footer className="h-14 border-t border-white/10 px-6 flex items-center justify-between bg-[#0a0a10]/80 backdrop-blur">
          <div className="text-md font-semibold text-slate-400">VeriFy</div>
          <div className="flex gap-2"></div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
