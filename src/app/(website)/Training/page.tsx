function Training() {
    return (
       <main>
          <section className="w-[1200px] mx-auto py-20 flex items-center h-[calc(100vh-200px)]">

<div className="flex flex-col gap-4 ">
  <h1 className="text-6xl">Our classes and how they operate</h1>
  <div className="grid grid-cols-3 gap-4">
    {[{id: 1, title: "One-on-one classes", desc: "Foundational courses for grades 1-5, focusing on core skills in math, reading, and writing."}, 
      {id: 2, title: "Group classes", desc: "Foundational courses for grades 1-5, focusing on core skills in math, reading, and writing."},
      {id: 3, title: "Online classes", desc: "Foundational courses for grades 1-5, focusing on core skills in math, reading, and writing."},
    ].map((item, i) => (
      <div key={i} className="flex flex-col gap-2 p-8 bg-amber-100 rounded-lg">
        <h1 className="text-2xl text-black">{item.title}</h1>
        <p className="text-black/50 text-sm">{item.desc}</p>
      </div>
    ))}
  </div>
</div>

</section>
       </main>
    )
}

export default Training
