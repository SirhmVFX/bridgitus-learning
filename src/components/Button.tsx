import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode;
  type: "button" | "link";
  variant?: "filled" | "outline";
  href?: string;
  className?: string;
}

function Button({ 
  children, 
  type, 
  variant = "filled",
  href = "", 
  className = "" 
}: ButtonProps) {
  const baseStyles = "px-6 py-2  font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 "
  
  const variantStyles = {
    filled: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-white/50 text-white/50 bg-transparent hover:bg-blue-50"
  }

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`

  return type === "button" ? (
    <button className={buttonClasses}>
      {children}
    </button>
  ) : (
    <Link href={href} className={buttonClasses}>
      {children}
    </Link>
  );
}

export default Button;