import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "~/axios/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "URL Shortener" },
    { name: "description", content: "Shorten and share URLs easily" },
  ];
}

interface ShortUrl {
  id: string;
  original: string;
  shortCode: string;
  accessCount: number;
  updatedAt: string;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const [curShortenedUrl, setCurShortenedUrl] = useState<ShortUrl | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await api.get<ShortUrl[]>("/urls");
        setShortUrls(res.data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      }
    };
    fetchUrls();
  }, []);

  const shortenUrl = async () => {
    if (!url) {
      toast.error("Enter a valid URL!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ShortUrl>("/urls", { url });

      setCurShortenedUrl(res.data);

      setShortUrls((prev) => [res.data, ...prev]);

      toast.success("Short URL created!");
      setUrl("");
    } catch (error) {
      toast.error("Failed to shorten URL");
    }
    setLoading(false);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.info("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gray-50">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">URL Shortener</h1>
      <p className="text-gray-600 mb-6">
        Shorten your URLs and share them easily
      </p>

      {/* Input Field */}
      <div className="flex w-full max-w-xl">
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-l-lg flex-1 text-gray-700 focus:ring focus:ring-slate-400 outline-none"
          placeholder="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={shortenUrl}
          className="bg-slate-900 text-white px-6 py-3 rounded-r-lg font-medium hover:bg-slate-800 transition"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </div>

      {/* Shortened URL Section */}
      <div className="mt-8 w-full max-w-xl">
        {curShortenedUrl && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Your Shortened URL
            </h2>
            <ShortenURLCard
              shortUrl={curShortenedUrl}
              copyToClipboard={copyToClipboard}
            />
          </>
        )}

        {/* Recent URLs */}
        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
          Recent URLs
        </h2>
        <div className="flex flex-col">
          {shortUrls.length === 0 ? (
            <p className="text-gray-500">No shortened URLs yet.</p>
          ) : (
            shortUrls.map((item) => (
              <ShortenURLCard
                key={item.id}
                shortUrl={item}
                copyToClipboard={copyToClipboard}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const ShortenURLCard = ({
  shortUrl,
  copyToClipboard,
}: {
  shortUrl: ShortUrl;
  copyToClipboard: (url: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200 w-full">
      <a
        href={`${import.meta.env.VITE_SERVICE_URL}/urls/${shortUrl.shortCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-medium hover:underline truncate flex-1"
      >
        {`${import.meta.env.VITE_SERVICE_URL}/urls/${shortUrl.shortCode}`}
      </a>

      <div className="flex items-center gap-6 mt-2 md:mt-0">
        <span className="text-gray-600 text-sm min-w-[60px] text-right">
          {shortUrl.accessCount ? shortUrl.accessCount : 0} views
        </span>
        <span className="text-gray-500 text-sm min-w-[90px] text-right">
          {formatDistanceToNow(new Date(shortUrl.updatedAt))} ago
        </span>

        <button
          onClick={() =>
            copyToClipboard(
              `${import.meta.env.VITE_SERVICE_URL}/urls/${shortUrl.shortCode}`
            )
          }
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <FontAwesomeIcon icon={faCopy} className="text-gray-600 text-lg" />
        </button>
      </div>
    </div>
  );
};
