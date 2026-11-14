import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ArrowUpRight, ShoppingBag } from "lucide-react";

function imageOf(product) {
  const value =
    product.image ||
    product.image_url ||
    product.thumbnail ||
    (Array.isArray(product.images) ? product.images[0] : "");
  return typeof value === "string" ? value : "";
}

function productKey(product) {
  return String(
    product.store_id ??
    product.id ??
    product.name ??
    product.title
  );
}

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("muse-wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Catalogue unavailable");
        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        if (!Array.isArray(list) || !list.length) {
          throw new Error("No products were returned by the catalogue API");
        }

        // Defensive de-duplication: the API should already provide store_id.
        const unique = [];
        const seen = new Set();
        for (const product of list) {
          const key = productKey(product);
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(product);
          }
        }

        if (active) {
          setProducts(unique);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load the catalogue.");
          setProducts([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const searchable = [
        product.name,
        product.title,
        product.brand,
        product.category,
        product.subcategory,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [products, category, query]);

  function toggleWishlist(product) {
    const key = productKey(product);
    const exists = wishlist.some((item) => productKey(item) === key);
    const next = exists
      ? wishlist.filter((item) => productKey(item) !== key)
      : [...wishlist, { ...product, store_id: key }];

    setWishlist(next);
    localStorage.setItem("muse-wishlist", JSON.stringify(next));
  }

  return (
    <main className="min-h-screen bg-[#090811] px-5 py-12 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold tracking-[.25em] text-violet-300">
              THE MUSE EDIT
            </p>
            <h1 className="mt-3 text-4xl font-bold">
              Explore the <span className="text-violet-400">Store.</span>
            </h1>
            <p className="mt-2 text-gray-400">
              Explore fashion, tech, audio and everyday essentials.
            </p>
            {!loading && (
              <p className="mt-2 text-sm text-violet-300">
                {products.length} products in the demo catalogue
              </p>
            )}
          </div>
          <Link
            to="/"
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Ask MUSE to find something →
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#151421] px-4">
            <Search size={18} className="text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands or categories..."
              className="w-full bg-transparent py-4 outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#151421] px-4 py-3 text-white outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="py-12 text-center text-gray-400">Loading MUSE catalogue...</p>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-center">
            <p className="font-medium text-amber-200">Could not load the catalogue</p>
            <p className="mt-2 text-sm text-gray-400">{error}</p>
            <p className="mt-2 text-xs text-gray-500">
              Check that the Flask backend is running and that the frontend is using its API URL.
            </p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-2xl border border-white/10 p-8 text-center text-gray-400">
            No products match that search.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const key = productKey(product);
            const saved = wishlist.some((item) => productKey(item) === key);
            const image = imageOf(product);
            const name = product.name || product.title || "Product";
            const price = Number(product.price ?? product.displayed_price ?? 0);

            return (
              <article
                key={key}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#151421] transition hover:-translate-y-1 hover:border-violet-400/40"
              >
                <div className="relative flex h-52 items-center justify-center bg-[#0d0c15] p-5">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const fallback = event.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="h-full w-full items-center justify-center text-violet-300"
                    style={{ display: image ? "none" : "flex" }}
                  >
                    <ShoppingBag size={42} strokeWidth={1.2} />
                  </div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 p-2 text-white hover:text-pink-300"
                  >
                    <Heart size={18} fill={saved ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-violet-300">
                    {product.brand || product.category || "MUSE PICK"}
                  </p>
                  <h2 className="mt-2 min-h-12 font-semibold">{name}</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.subcategory || product.catalogue_source || product.category}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1 text-sm text-violet-300 hover:text-white"
                    >
                      Ask MUSE <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Catalogue products and prices are sample/demo data and may not reflect live retailer availability.
          Product photos are illustrative or supplied by the respective product brands.
        </p>
      </div>
    </main>
  );
}
