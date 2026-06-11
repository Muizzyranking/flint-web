type FlintLogoProps = {
  className?: string;
};

export function FlintLogo({ className }: FlintLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 33.5 19.8 10.9c.9-1.7 3.5-1.5 4.1.4l5 15.4c.4 1.2-.2 2.4-1.3 2.9L11.4 36c-2.2.9-4.4-.5-3.4-2.5Z"
        className="fill-foreground"
      />
      <path
        d="M40 33.5 28.2 10.9c-.9-1.7-3.5-1.5-4.1.4l-5 15.4c-.4 1.2.2 2.4 1.3 2.9L36.6 36c2.2.9 4.4-.5 3.4-2.5Z"
        className="fill-muted-foreground"
      />
      <path
        d="m20.8 23.4 8.3-8.7-2.4 7.5 6.9.5-8.9 9.4 2.6-8.2-6.5-.5Z"
        className="fill-accent"
      />
      <path
        d="M23.7 5.5v4.1M15.4 10.1l2.8 2.8M32.6 10.1l-2.8 2.8M24 36.9v5.6M34.8 32.8l3.4 3.4"
        className="stroke-accent"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
