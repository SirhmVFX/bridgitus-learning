import Link from "next/link"

function Footer() {
    return (
        <footer className="bg-gray-800 md:p-20 p-10">
            <div className="md:w-[1200px] w-full md:mx-auto md:grid md:grid-cols-4 grid grid-cols-2">

                <div></div>
                <div className="flex flex-col gap-4">
                    <h1 className="text-sm text-white">Legal</h1>
                    {[{id: 1, title: "Terms & Conditions", url: "#"}, {id: 2, title: "Terms & Conditions", url: "#"}, {id: 3, title: "Terms & Conditions", url: "#"}, {id: 4, title: "Terms & Conditions", url: "#"}].map((e) => (
                        <Link className="text-xs text-white/50" key={e.id} href={e.url}>{e.title}</Link> 
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-sm text-white">Legal</h1>
                    {[{id: 1, title: "Terms & Conditions", url: "#"}, {id: 2, title: "Terms & Conditions", url: "#"}, {id: 3, title: "Terms & Conditions", url: "#"}, {id: 4, title: "Terms & Conditions", url: "#"}].map((e) => (
                        <Link className="text-xs text-white/50" key={e.id} href={e.url}>{e.title}</Link> 
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-sm text-white">Legal</h1>
                    {[{id: 1, title: "Terms & Conditions", url: "#"}, {id: 2, title: "Terms & Conditions", url: "#"}, {id: 3, title: "Terms & Conditions", url: "#"}, {id: 4, title: "Terms & Conditions", url: "#"}].map((e) => (
                        <Link className="text-xs text-white/50" key={e.id} href={e.url}>{e.title}</Link> 
                    ))}
                </div>
            </div>

        </footer>
    )
}


export default Footer