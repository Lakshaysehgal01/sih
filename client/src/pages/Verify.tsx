import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  GraduationCap,
  Hash,
  Building,
  Mail,
  Download,
  ExternalLink,
  Loader2,
  Copy,
} from "lucide-react";

interface DocumentDetails {
  name: string;
  enrollNo: string;
  course: string;
  year: string;
  certHash: string;
  QrLink: string;
  issuedAt: string;
  university: {
    universityName: string;
    email: string;
  };
}

interface VerificationResult {
  valid: boolean;
  issuer?: string;
  url?: string;
  document?: DocumentDetails;
  blockchain?: {
    valid: boolean;
  };
  university?: {
    universityName: string;
    email: string;
    AISHE: string;
  };
  message?: string;
}

interface University {
  _id: string;
  universityName: string;
  email: string;
  AISHE: string;
}

interface UniversityMain {
  university: University;
}

const Verify = () => {
  const { certHash } = useParams<{ certHash: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [university, setUniversity] = useState<UniversityMain | null>(null);

  useEffect(() => {
    if (certHash) {
      verifyDocument();
    }
  }, [certHash]);

  const verifyDocument = async () => {
    if (!certHash) {
      setError("No certificate hash provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(`/public/verify/${certHash}`);
      const formattedIssuer = response.data.issuer.toLocaleString();
      console.log(formattedIssuer);
      const universityDetails = await axiosInstance.get(
        `/public/universities/${response?.data?.issuer}`
      );
      console.log(universityDetails.data);
      setUniversity(universityDetails.data);

      if (response.data.valid) {
        toast.success("Document verified successfully!");
      } else {
        toast.error("Document verification failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to verify document";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDocument = () => {
    // Prioritize blockchain URL, fall back to QrLink from database
    const documentUrl = result?.url || result?.document?.QrLink;
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error(`Failed to copy ${label}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Verifying Document
          </h2>
          <p className="text-gray-300">
            Please wait while we verify the certificate...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Certificate Verification
          </h1>
          <p className="text-gray-300 text-lg">
            Blockchain-powered document authentication
          </p>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            {error ? (
              <XCircle className="w-16 h-16 text-red-400" />
            ) : result?.valid ? (
              <CheckCircle className="w-16 h-16 text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400" />
            )}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {error
                ? "Verification Error"
                : result?.valid
                ? "✅ Document Verified"
                : "❌ Verification Failed"}
            </h2>
            <p className="text-gray-300">
              {error ||
                result?.message ||
                (result?.valid
                  ? "This document is authentic and verified on the blockchain"
                  : "This document could not be verified")}
            </p>
          </div>

          {/* Blockchain Status */}
          {result?.blockchain && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">
                  Blockchain Status:{" "}
                  {result.blockchain.valid ? "✅ Verified" : "❌ Not Found"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Document Details */}
        {result?.document && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Document Details
              </h3>

              {(result.url || result.document.QrLink) && (
                <button
                  onClick={openDocument}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>View Document</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-purple-300 mb-3">
                  Student Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Student Name</p>
                      <p className="text-white font-medium">
                        {result.document.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Enrollment Number</p>
                      <p className="text-white font-medium">
                        {result.document.enrollNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Course</p>
                      <p className="text-white font-medium">
                        {result.document.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Year</p>
                      <p className="text-white font-medium">
                        {result.document.year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* University & Verification Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-purple-300 mb-3">
                  Issuing Authority
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">University</p>
                      <p className="text-white font-medium">
                        {result.document.university.universityName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Contact Email</p>
                      <p className="text-white font-medium">
                        {result.document.university.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Issued On</p>
                      <p className="text-white font-medium">
                        {formatDate(result.document.issuedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Certificate Hash</p>
                      <p className="text-white font-mono text-xs break-all bg-white/5 p-2 rounded">
                        {result.document.certHash}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blockchain Verification Details */}
        {result && (result.issuer || result.url || university) && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Hash className="w-6 h-6 mr-2" />
                Blockchain Verification
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* University Details */}
              {university && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">
                    University Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400">University Name</p>
                        <p className="text-white font-medium">
                          {university?.university?.universityName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Hash className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="w-full">
                        <p className="text-sm text-gray-400">AISHE Code</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-mono text-sm bg-white/5 p-2 rounded flex-1">
                            {university?.university?.AISHE}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                university?.university?.AISHE,
                                "AISHE code"
                              )
                            }
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors flex-shrink-0 flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="w-full">
                        <p className="text-sm text-gray-400">Email</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium flex-1">
                            {university?.university?.email}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                university?.university?.email,
                                "Email address"
                              )
                            }
                            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors flex-shrink-0 flex items-center space-x-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document File */}
              {result.url && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-green-300 mb-3">
                    Document File
                  </h4>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="w-full">
                      <p className="text-sm text-gray-400 mb-2">
                        Original Document
                      </p>
                      <div className="flex items-center space-x-2 mb-3">
                        <p className="text-white font-mono text-xs break-all bg-white/5 p-2 rounded flex-1">
                          {result.url}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(result.url!, "Document URL")
                          }
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors flex-shrink-0 flex items-center space-x-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <button
                        onClick={() => window.open(result.url, "_blank")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full md:w-auto"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Document</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-gray-400 text-sm">
            Powered by blockchain technology for secure and tamper-proof
            verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
