import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  X,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";
import { FilmPoster } from "./Portfolio";

interface EditPosterModalProps {
  poster: FilmPoster;
  defaultPoster: FilmPoster;
  onSave: (updated: FilmPoster) => void;
  onReset: (posterId: string) => void;
  onClose: () => void;
}

/**
 * Intelligently converts user-supplied links (like Google Drive, Postimg, etc.)
 * into directly embeddable image URLs.
 */
export function resolveImageUrl(inputUrl: string): { url: string; note?: string; isCanva?: boolean } {
  const trimmed = (inputUrl || "").trim();
  if (!trimmed) return { url: "" };

  // Check for Canva share link
  if (trimmed.includes("canva.link") || trimmed.includes("canva.com")) {
    return {
      url: trimmed,
      isCanva: true,
      note: "Canva share links are web pages, not direct image files. In Canva: Click Share → Download → PNG/JPG, then upload the downloaded image file here!",
    };
  }

  // Google Drive sharing link formats:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  const driveIdMatch =
    trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (driveIdMatch && driveIdMatch[1]) {
    const fileId = driveIdMatch[1];
    return {
      url: `https://lh3.googleusercontent.com/d/${fileId}`,
      note: "Google Drive link converted to direct high-resolution image URL.",
    };
  }

  // PostImage page link (e.g., https://postimg.cc/abc -> needs direct link or i.postimg.cc)
  if (trimmed.includes("postimg.cc/") && !trimmed.includes("i.postimg.cc")) {
    return {
      url: trimmed,
      note: "Make sure to copy the 'Direct link' from PostImage ending with .png or .jpg for best display.",
    };
  }

  // Dropbox share links
  if (trimmed.includes("dropbox.com") && trimmed.includes("dl=0")) {
    return {
      url: trimmed.replace("dl=0", "raw=1"),
      note: "Converted Dropbox link to direct raw image.",
    };
  }

  return { url: trimmed };
}

export default function EditPosterModal({
  poster,
  defaultPoster,
  onSave,
  onReset,
  onClose,
}: EditPosterModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "details">("upload");
  const [imageUrl, setImageUrl] = useState(poster.image);
  const [urlInput, setUrlInput] = useState(
    poster.image.startsWith("data:") ? "" : poster.image
  );
  const [urlNote, setUrlNote] = useState<string | null>(null);
  const [isCanvaWarning, setIsCanvaWarning] = useState(false);

  // Editable metadata
  const [title, setTitle] = useState(poster.title);
  const [tagline, setTagline] = useState(poster.tagline || "");
  const [director, setDirector] = useState(poster.director || "");
  const [vfx, setVfx] = useState(poster.vfx);
  const [badge, setBadge] = useState(poster.badge);
  const [year, setYear] = useState(poster.year);
  const [description, setDescription] = useState(poster.description || "");

  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process file upload to base64 with canvas optimization for crisp quality and localStorage safety
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return;

      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.9);
            setImageUrl(optimized);
          } else {
            setImageUrl(rawDataUrl);
          }
        } catch {
          setImageUrl(rawDataUrl);
        }
        setPreviewError(false);
        setUrlNote("Photo uploaded successfully / പുതിയ ഫോട്ടോ വിജയകരമായി അപ്‌ലോഡ് ചെയ്തു!");
        setIsCanvaWarning(false);
      };
      img.onerror = () => {
        setImageUrl(rawDataUrl);
        setPreviewError(false);
        setUrlNote("Photo uploaded successfully.");
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    const resolved = resolveImageUrl(value);
    setImageUrl(resolved.url);
    setPreviewError(false);
    setUrlNote(resolved.note || null);
    setIsCanvaWarning(!!resolved.isCanva);
  };

  const handleSave = () => {
    if (!imageUrl || isCanvaWarning) {
      alert("Please provide a valid image URL or upload an image file.");
      return;
    }

    onSave({
      ...poster,
      title: title.trim() || poster.title,
      tagline: tagline.trim(),
      director: director.trim(),
      vfx: vfx.trim() || "Mouse House VFX",
      badge: badge.trim() || poster.badge,
      year: year.trim() || poster.year,
      description: description.trim(),
      image: imageUrl,
    });
    setCopiedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleResetToDefault = () => {
    setImageUrl(defaultPoster.image);
    setUrlInput("");
    setTitle(defaultPoster.title);
    setTagline(defaultPoster.tagline || "");
    setDirector(defaultPoster.director || "");
    setVfx(defaultPoster.vfx);
    setBadge(defaultPoster.badge);
    setYear(defaultPoster.year);
    setDescription(defaultPoster.description || "");
    setUrlNote("Reset to official default artwork.");
    setIsCanvaWarning(false);
    setPreviewError(false);
    onReset(poster.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-vfx-card border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white transition-colors"
          title="Close modal"
        >
          <X size={20} />
        </button>

        {/* Left Side: Live Poster Preview */}
        <div className="md:w-5/12 bg-black/90 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neon-blue font-bold">
              Live Preview
            </span>
          </div>

          <div className="relative w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
            {previewError || isCanvaWarning ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-vfx-card/80">
                <AlertCircle className="text-amber-400 mb-2" size={32} />
                <p className="text-xs text-gray-200 font-semibold mb-1">
                  {isCanvaWarning ? "Canva Page Link" : "Image Load Error"}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight">
                  {isCanvaWarning
                    ? "Download the PNG from Canva and upload here."
                    : "URL not accessible. Try uploading the image file."}
                </p>
              </div>
            ) : (
              <img
                src={imageUrl || poster.image}
                alt="Poster preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
            )}

            {/* Simulated Badge Overlay */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/20 text-[9px] font-mono text-neon-blue font-bold">
              {badge}
            </div>
          </div>

          <p className="mt-3 text-xs text-white font-semibold text-center line-clamp-1">
            {title}
          </p>
          <p className="text-[11px] text-neon-purple text-center line-clamp-1">
            {tagline || (director ? `Dir. ${director}` : vfx)}
          </p>
        </div>

        {/* Right Side: Configuration & Upload Options */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-xs font-mono text-neon-blue mb-2">
                <Sparkles size={12} />
                <span>
                  {poster.id === "paithalattam" ? "Paithalattam Photo" : "Customize Film Poster"}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {poster.id === "paithalattam"
                  ? "Change Paithalattam (പൈതലോട്ടം) Photo"
                  : "Change Poster Artwork"}
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                {poster.id === "paithalattam"
                  ? "ഫോണിൽ നിന്നോ കമ്പ്യൂട്ടറിൽ നിന്നോ പുതിയ ഫോട്ടോ തിരഞ്ഞെടുക്കുക (Choose new photo from phone or PC)."
                  : "Upload your new artwork, paste an image link, or adjust the film details."}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "upload"
                    ? "bg-neon-blue text-vfx-dark shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Upload size={14} />
                <span>Upload File / ഫോട്ടോ മാറ്റുക</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "url"
                    ? "bg-neon-blue text-vfx-dark shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <LinkIcon size={14} />
                <span>Image Link</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "details"
                    ? "bg-neon-blue text-vfx-dark shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sliders size={14} />
                <span>Details / വിവരങ്ങൾ</span>
              </button>
            </div>

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-neon-blue bg-neon-blue/10 scale-[1.01]"
                      : "border-neon-blue/40 hover:border-neon-blue bg-white/5 hover:bg-white/[0.08]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 mx-auto rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue mb-3">
                    <Upload size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Click here to choose photo from your device
                  </h4>
                  <p className="text-xs text-neon-blue font-medium mb-2">
                    ഫോട്ടോ തിരഞ്ഞെടുക്കാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക (Browse Image)
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Supports JPG, PNG, WEBP (Supports phone camera photos &amp; high-res images)
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-xs text-gray-300">
                  <Info size={16} className="text-neon-blue shrink-0 mt-0.5" />
                  <span>
                    The photo is saved directly in your browser and will stay updated every time you open the site.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: IMAGE URL */}
            {activeTab === "url" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Paste Image Link / Web Address
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://example.com/poster.jpg or Google Drive link"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 focus:border-neon-blue text-sm text-white placeholder-gray-500 focus:outline-none"
                    />
                    {urlInput && (
                      <button
                        type="button"
                        onClick={() => handleUrlChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Canva specific assistance banner */}
                {isCanvaWarning && (
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle size={16} className="text-amber-400" />
                      <span>Canva Link Detected</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Canva viewer links cannot be directly loaded inside an image tag. To use your Canva design:
                    </p>
                    <ol className="list-decimal list-inside text-[11px] space-y-1 pl-1 text-gray-300">
                      <li>Open your design in Canva.</li>
                      <li>Click <strong>Share</strong> → <strong>Download</strong> (select PNG or JPG).</li>
                      <li>Switch to the <strong>Upload File</strong> tab above and select the file!</li>
                    </ol>
                    {urlInput && (
                      <a
                        href={urlInput}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline pt-1"
                      >
                        <ExternalLink size={12} />
                        <span>Open Canva link in new tab to download</span>
                      </a>
                    )}
                  </div>
                )}

                {urlNote && !isCanvaWarning && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    <Check size={14} className="shrink-0" />
                    <span>{urlNote}</span>
                  </div>
                )}

                <div className="text-[11px] text-gray-400 space-y-1">
                  <p className="font-semibold text-gray-300">Supported formats:</p>
                  <p>• Direct links (.jpg, .png, .webp)</p>
                  <p>• Google Drive shared images (automatically converted)</p>
                  <p>• PostImage / ImgBB / Imgur direct links</p>
                </div>
              </div>
            )}

            {/* TAB 3: DETAILS */}
            {activeTab === "details" && (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Film Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Director
                    </label>
                    <input
                      type="text"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      placeholder="e.g. Sreerosh"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Release Year
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                      VFX Credits
                    </label>
                    <input
                      type="text"
                      value={vfx}
                      onChange={(e) => setVfx(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                    Synopsis / Awards
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 focus:border-neon-blue text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Reset this poster back to default official artwork"
            >
              <RotateCcw size={13} />
              <span>Reset to Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isCanvaWarning || !imageUrl}
                className="px-5 py-2 rounded-xl bg-neon-blue hover:bg-neon-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-vfx-dark font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                {copiedSuccess ? (
                  <>
                    <Check size={14} />
                    <span>Saved! / സേവ് ചെയ്തു!</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} />
                    <span>Apply &amp; Save / സേവ് ചെയ്യുക</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
