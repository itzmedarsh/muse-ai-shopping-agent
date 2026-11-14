import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('muse-wishlist') || '[]') } catch { return [] }
  })

  function removeItem(item) {
    const id = String(item.store_id ?? item.id ?? item.name ?? item.title)
    const next = items.filter((p) => String(p.store_id ?? p.id ?? p.name ?? p.title) !== id)
    setItems(next)
    localStorage.setItem('muse-wishlist', JSON.stringify(next))
  }

  return (
    <main className="min-h-screen bg-[#090811] px-5 py-12 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-[.25em] text-violet-300">SAVED FOR LATER</p>
        <h1 className="mt-3 text-4xl font-bold">Your <span className="text-violet-400">Wishlist.</span></h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#151421] p-10 text-center">
            <p className="text-gray-400">Your wishlist is empty.</p>
            <Link to="/store" className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold">Explore the store</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const id = String(p.store_id ?? p.id ?? p.name ?? p.title)
              const image = p.image || p.image_url || p.thumbnail || (Array.isArray(p.images) ? p.images[0] : '')
              return (
                <article key={id} className="rounded-2xl border border-white/10 bg-[#151421] p-5">
                  <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-[#0b0b12] p-3">
                    {image ? (
                      <img
                        src={image}
                        alt={p.name || p.title || "Saved product"}
                        loading="lazy"
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          const fallback = event.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = "grid";
                        }}
                      />
                    ) : null}
                    <div className="h-full w-full place-items-center text-4xl text-violet-300" style={{ display: image ? "none" : "grid" }}>🛍️</div>
                  </div>
                  <h2 className="font-semibold">{p.name || p.title || 'Product'}</h2>
                  <p className="mt-2 text-violet-300">₹{Number(p.price ?? p.displayed_price ?? 0).toLocaleString('en-IN')}</p>
                  <button onClick={() => removeItem(p)} className="mt-4 text-sm text-rose-300 hover:text-rose-200">Remove</button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
