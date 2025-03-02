import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import api from "~/axios/axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        await api.get(`/urls/${shortCode}`);
      } catch (error) {
        setError(true);
        toast.error("Failed to redirect. The URL may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [shortCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center w-1/4"
      >
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-blue-600 w-10 h-10"
            />
            <p className="text-gray-600 text-lg">Redirecting...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 w-10 h-10"
            />
            <p className="text-red-600 font-medium">Failed to redirect</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-700">
              If you're not redirected, please try again later.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
