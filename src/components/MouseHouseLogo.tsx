import React from "react";

interface MouseHouseLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  withBackground?: boolean;
  variant?: "white" | "neon" | "gradient";
}

export default function MouseHouseLogo({
  className = "",
  size = 48,
  showText = true,
  withBackground = false,
  variant = "white",
}: MouseHouseLogoProps) {
  // When showText is true, it displays the entire logo lockup:
  // MH Monogram + Mouse inside + MOUSE HOUSE + — VFX —
  // When showText is false, it displays the iconic MH Monogram with the mouse
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ height: size }}
    >
      <svg
        viewBox={showText ? "0 0 500 500" : "90 60 315 250"}
        className="h-full w-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mh-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#9d4edd" />
          </linearGradient>
          <filter id="mh-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {withBackground && (
          <rect width="500" height="500" rx="36" fill="#121318" />
        )}

        <g
          fill={
            variant === "gradient"
              ? "url(#mh-neon-grad)"
              : variant === "neon"
              ? "#00d2ff"
              : "#ffffff"
          }
          filter={variant === "neon" ? "url(#mh-glow)" : undefined}
        >
          {/* MONOGRAM "MH" */}
          {/* Left vertical stem of M */}
          <rect x="115" y="80" width="50" height="215" rx="2" />

          {/* Center V of M */}
          <path
            d="M 165 80 
               L 225 195 
               L 285 80 
               L 252 80 
               L 225 142 
               L 198 80 
               Z"
          />

          {/* Right vertical stem of M */}
          <rect x="285" y="80" width="50" height="215" rx="2" />

          {/* H Extension on top-right */}
          <path
            d="M 335 80 
               L 385 80 
               L 385 175 
               L 335 175 
               L 335 150 
               L 358 150 
               L 358 115 
               L 335 115 
               Z"
          />

          {/* MOUSE SILHOUETTE INSIDE ARCH */}
          {/* Body and Head */}
          <path
            d="M 176 270
               C 172 242, 192 220, 218 220
               C 228 220, 238 225, 244 230
               C 248 226, 254 224, 258 228
               C 264 233, 262 240, 258 243
               C 266 246, 276 250, 278 255
               C 278 259, 272 262, 264 264
               C 258 268, 254 278, 254 295
               L 185 295
               C 178 288, 177 278, 176 270 Z"
          />

          {/* Mouse Ear Detail */}
          <path
            d="M 242 226
               C 238 214, 252 206, 260 215
               C 266 222, 262 234, 250 232 Z"
          />

          {/* Inner Ear cutout */}
          <ellipse cx="251" cy="222" rx="4" ry="5.5" fill="#121318" />

          {/* Eye cutout */}
          <circle cx="262" cy="246" r="3.2" fill="#121318" />

          {/* Mouse Whiskers */}
          <g
            stroke={
              variant === "gradient"
                ? "url(#mh-neon-grad)"
                : variant === "neon"
                ? "#00d2ff"
                : "#ffffff"
            }
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <line x1="276" y1="251" x2="304" y2="240" />
            <line x1="278" y1="254" x2="310" y2="252" />
            <line x1="277" y1="257" x2="307" y2="266" />
            <line x1="275" y1="260" x2="298" y2="277" />
          </g>

          {/* Mouse Tail */}
          <path
            d="M 178 274 
               C 160 282, 142 287, 130 292
               C 122 296, 126 301, 135 298
               C 148 293, 164 288, 180 280 Z"
          />

          {/* Paws */}
          <ellipse cx="196" cy="295" rx="10" ry="4" />
          <ellipse cx="248" cy="295" rx="8" ry="4" />

          {showText && (
            <>
              {/* TYPOGRAPHY */}
              {/* MOUSE HOUSE */}
              <text
                x="250"
                y="352"
                fill={
                  variant === "gradient"
                    ? "url(#mh-neon-grad)"
                    : variant === "neon"
                    ? "#00d2ff"
                    : "#ffffff"
                }
                fontFamily="system-ui, -apple-system, 'Outfit', 'Montserrat', 'Inter', sans-serif"
                fontWeight="900"
                fontSize="40"
                letterSpacing="5"
                textAnchor="middle"
              >
                MOUSE HOUSE
              </text>

              {/* SUBTITLE WINGS & VFX */}
              <line
                x1="95"
                y1="395"
                x2="198"
                y2="395"
                stroke={
                  variant === "gradient"
                    ? "url(#mh-neon-grad)"
                    : variant === "neon"
                    ? "#00d2ff"
                    : "#ffffff"
                }
                strokeWidth="4.5"
                strokeLinecap="round"
              />

              <text
                x="250"
                y="403"
                fill={
                  variant === "gradient"
                    ? "url(#mh-neon-grad)"
                    : variant === "neon"
                    ? "#00d2ff"
                    : "#ffffff"
                }
                fontFamily="system-ui, -apple-system, 'Outfit', 'Montserrat', 'Inter', sans-serif"
                fontWeight="800"
                fontSize="24"
                letterSpacing="10"
                textAnchor="middle"
              >
                VFX
              </text>

              <line
                x1="302"
                y1="395"
                x2="405"
                y2="395"
                stroke={
                  variant === "gradient"
                    ? "url(#mh-neon-grad)"
                    : variant === "neon"
                    ? "#00d2ff"
                    : "#ffffff"
                }
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
