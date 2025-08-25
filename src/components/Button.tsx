import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  style: "button" | "link";
  variant?: "filled" | "outline";
  href?: string;
  className?: string;
  onClick?: () => void;
}

function Button({
  children,
  style,
  variant = "filled",
  href = "",
  className = "",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "px-5 py-3 text-center  font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px]";

  const variantStyles = {
    filled:
      "bg-secondary-color text-white hover:bg-blue-700 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500 transition-all duration-200",
    outline:
      "border border-black/50 text-black/50 bg-transparent hover:bg-white/10 hover:scale-110 hover:shadow-2xl hover:shadow-white/20 transition-all duration-200",
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return style === "button" ? (
    <button onClick={onClick} type="submit" className={buttonClasses}>
      {children}
    </button>
  ) : (
    <Link href={href} className={buttonClasses}>
      {children}
    </Link>
  );
}

export default Button;
