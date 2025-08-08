import Link from "next/link"
import Button from "./Button"

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 text-white">
        <div className="w-[1200px] mx-auto flex justify-between py-5">
      <h1>Logo</h1>

      <div>
        <ul className="flex gap-5 items-center">
            <Link className="text-sm" href="/about">About</Link>
            <Link className="text-sm" href="/projects">Projects</Link>
            <Link className="text-sm" href="/training">Training</Link>
            <Link className="text-sm" href="/community">Community</Link>
            <Link className="text-sm" href="/contact">Contact</Link>
            <Button type="button">Register Now</Button>
        </ul>
      </div>
    </div>
    </header>
  )
}

export default Header