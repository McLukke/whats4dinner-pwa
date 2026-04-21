export default function AsianPlaceholder({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#7A1010] overflow-hidden ${className}`}
      style={{
        backgroundImage: [
          "repeating-linear-gradient(0deg, rgba(212,175,55,0.12) 0, rgba(212,175,55,0.12) 1px, transparent 1px, transparent 24px)",
          "repeating-linear-gradient(90deg, rgba(212,175,55,0.12) 0, rgba(212,175,55,0.12) 1px, transparent 1px, transparent 24px)",
          "repeating-linear-gradient(45deg, rgba(212,175,55,0.07) 0, rgba(212,175,55,0.07) 1px, transparent 1px, transparent 17px)",
          "repeating-linear-gradient(-45deg, rgba(212,175,55,0.07) 0, rgba(212,175,55,0.07) 1px, transparent 1px, transparent 17px)",
        ].join(","),
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
          {/* Steam */}
          <path d="M18 19 Q15 13 18 8" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <path d="M26 17 Q23 11 26 6" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          <path d="M34 19 Q31 13 34 8" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
          {/* Bowl fill */}
          <path d="M10 24 Q10 40 26 40 Q42 40 42 24 Z" fill="#D4AF37" opacity="0.2"/>
          {/* Bowl curve */}
          <path d="M10 24 Q10 40 26 40 Q42 40 42 24" stroke="#D4AF37" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Rim */}
          <line x1="8" y1="24" x2="44" y2="24" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Base */}
          <line x1="18" y1="41" x2="34" y2="41" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round"/>
          {/* Chopsticks */}
          <line x1="14" y1="43" x2="5" y2="51" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
          <line x1="38" y1="43" x2="47" y2="51" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
        </svg>
        <span
          className="text-[#D4AF37] font-medium uppercase opacity-70"
          style={{ fontSize: "10px", letterSpacing: "0.2em" }}
        >
          No Photo
        </span>
      </div>
    </div>
  );
}
