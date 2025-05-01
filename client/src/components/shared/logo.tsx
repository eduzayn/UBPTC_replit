interface LogoProps {
  className?: string;
  color?: string;
}

export default function Logo({ className = "", color = "#2BCBDA" }: LogoProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="300" cy="300" r="300" fill="#f8f8f8" />
      <path
        d="M139 300C139 208.873 212.873 135 304 135H461V360C461 451.127 387.127 525 296 525H139V300Z"
        fill="#222222"
      />
      <text
        x="300"
        y="380"
        fontFamily="'Montserrat', sans-serif"
        fontSize="220"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
      >
        UBP
      </text>
      <circle cx="323" cy="200" r="40" fill={color} />
      <text
        x="485"
        y="385"
        fontFamily="'Montserrat', sans-serif"
        fontSize="80"
        fontWeight="700"
        fill={color}
        textAnchor="middle"
      >
        CT
      </text>
    </svg>
  );
}
