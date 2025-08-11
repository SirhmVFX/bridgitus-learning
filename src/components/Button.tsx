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
  const baseStyles = "px-6 py-4  font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 text-xs"
  
  const variantStyles = {
    filled: "bg-secondary-color text-white hover:bg-blue-700 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500 transition-all duration-200",
    outline: "border border-white/50 text-white/50 bg-transparent hover:bg-white/10 hover:scale-110 hover:shadow-2xl hover:shadow-white/20 transition-all duration-200"
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