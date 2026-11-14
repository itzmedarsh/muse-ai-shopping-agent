import { useMemo, useState } from "react";

import { Link } from "react-router-dom";



const cx = (...classes) => classes.filter(Boolean).join(" ");



function formatPrice(price, currency = "INR") {

    if (price === null || price === undefined || price === "") return "Price unavailable";

    const value = Number(price);

    if (!Number.isFinite(value)) return "Price unavailable";



    try {

        return new Intl.NumberFormat("en-IN", {

            style: "currency",

            currency,

            maximumFractionDigits: 0,

        }).format(value);

    } catch {

        return `₹${value.toLocaleString("en-IN")}`;

    }

}



const cleanImage = (url) => {
    if (!url || typeof url !== "string") return null;

    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
        return url;
    }

    return null;
};

function getProductImage(product) {
    if (!product || typeof product !== "object") return "";
    return cleanImage(
        product.image ||
        product.image_url ||
        product.thumbnail ||
        product.images ||
        product.image_gallery
    );
}



function displayValue(value) {

    if (value === null || value === undefined || value === "") return "Not available";

    if (typeof value === "boolean") return value ? "Yes" : "No";

    if (Array.isArray(value)) return value.length ? value.join(", ") : "None";

    if (typeof value === "object") return Object.entries(value)

        .map(([key, item]) => `${key.replaceAll("_", " ")}: ${displayValue(item)}`)

        .join(" · ");

    return String(value);

}



function StatusPill({ status }) {

    const value = String(status || "unavailable").toLowerCase();

    const styles = {

        confirmed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

        compatible: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

        inferred: "border-amber-400/30 bg-amber-400/10 text-amber-200",

        success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

        completed: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

        running: "border-sky-400/30 bg-sky-400/10 text-sky-200",

        error: "border-rose-400/30 bg-rose-400/10 text-rose-300",

        failed: "border-rose-400/30 bg-rose-400/10 text-rose-300",

        skipped: "border-white/10 bg-white/5 text-gray-400",

        not_applicable: "border-white/10 bg-white/5 text-gray-400",

        unknown: "border-amber-400/30 bg-amber-400/10 text-amber-200",

        unavailable: "border-white/10 bg-white/5 text-gray-400",

        measurement_required: "border-amber-400/30 bg-amber-400/10 text-amber-200",

    };



    return (

        <span className={cx(

            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize",

            styles[value] || styles.unknown

        )}>

            {value.replaceAll("_", " ")}

        </span>

    );

}



function SectionHeading({ eyebrow, title, description, right }) {

    return (

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">

            <div>

                {eyebrow && (

                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">

                        {eyebrow}

                    </p>

                )}

                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>

                {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">{description}</p>}

            </div>

            {right}

        </div>

    );

}



const WISHLIST_KEY = "muse-wishlist";

function productWishlistId(product) {
    return String(product?.store_id ?? product?.id ?? product?.name ?? "");
}

function readWishlist() {
    try {
        const value = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function WishlistButton({ product }) {
    const [saved, setSaved] = useState(() =>
        readWishlist().some((item) => productWishlistId(item) === productWishlistId(product))
    );

    function toggleSaved() {
        const current = readWishlist();
        const id = productWishlistId(product);
        const exists = current.some((item) => productWishlistId(item) === id);
        const next = exists ? current.filter((item) => productWishlistId(item) !== id) : [...current, product];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
        setSaved(!exists);
        window.dispatchEvent(new Event("muse-wishlist-updated"));
    }

    return (
        <button type="button" onClick={toggleSaved} aria-pressed={saved}
            className={`mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${saved ? "border-violet-400/40 bg-violet-400/10 text-violet-200" : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-violet-400/40 hover:text-white"
                }`}>
            <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
            {saved ? "Saved to Wishlist" : "Add to Wishlist"}
        </button>
    );
}

function ProductImage({ product, large = false }) {

    const [failed, setFailed] = useState(false);
    const image = getProductImage(product);
    const category = String(product?.category || "").toLowerCase();
    const subcategory = String(product?.subcategory || "").toLowerCase();
    const specs = product?.specifications && typeof product.specifications === "object" ? product.specifications : {};
    const colour = String(specs.colour || specs.color || product?.colour || product?.color || "#8b5cf6").toLowerCase();
    const colourMap = {
        black: "#171717", white: "#f5f5f4", red: "#dc2626", blue: "#2563eb",
        "light blue": "#7dd3fc", "dark blue": "#1e40af", navy: "#172554",
        green: "#15803d", olive: "#65743a", gray: "#6b7280", grey: "#6b7280",
        beige: "#d6c2a1", brown: "#854d0e", pink: "#ec4899", purple: "#7c3aed",
        yellow: "#eab308", orange: "#ea580c", maroon: "#7f1d1d", "off-white": "#e7e5e4",
        cream: "#f5f0dc", charcoal: "#374151", silver: "#cbd5e1", gold: "#d4a017",
        teal: "#0f766e", khaki: "#a18f62",
    };
    const fill = colourMap[colour] || "#8b5cf6";
    const productName = String(product?.name || product?.title || "").toLowerCase();
    // Only use the clothing illustration when the product itself is clearly apparel.
    // A stray/misclassified subcategory must never turn an electronics item into a shirt.
    const isApparelCategory = ["fashion", "clothing", "apparel"].includes(category);
    const isApparelName = /\b(t-?shirts?|tees?|shirts?|hoodies?|sweatshirts?|jackets?|dresses?|tops|sweaters?)\b/.test(productName);
    const isApparel = isApparelCategory || isApparelName;
    const isTop = isApparel && (/\b(t-?shirts?|tees?|shirts?|hoodies?|sweatshirts?|tops)\b/.test(subcategory) || /\b(t-?shirts?|tees?|shirts?|hoodies?|sweatshirts?|tops)\b/.test(productName));
    const hasVerifiedColour = Boolean(specs.colour || specs.color || product?.colour || product?.color);

    // Synthetic fashion catalogue photography was reused across colours/SKUs.
    // Prefer an attribute-accurate illustration to a misleading stock photo.
    if (isApparel && isTop && hasVerifiedColour) {
        return (
            <div className={cx("flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10", large ? "min-h-72" : "h-44")}>
                <svg viewBox="0 0 160 150" role="img" aria-label={`${colour} ${product?.name || "apparel"} illustration`} className={large ? "h-64 w-64" : "h-36 w-36"}>
                    <path d="M48 20 66 12 Q80 22 94 12 L112 20 145 45 128 68 111 57 111 137 49 137 49 57 32 68 15 45Z" fill={fill} stroke="rgba(255,255,255,.35)" strokeWidth="3" strokeLinejoin="round" />
                    <path d="M66 13 Q80 31 94 13" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="3" />
                </svg>
            </div>
        );
    }

    if (!image || failed) {
        return (
            <div className={cx("flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10", large ? "min-h-72" : "h-44")}>
                <span className={large ? "text-7xl" : "text-5xl"} aria-hidden="true">🛍️</span>
            </div>
        );
    }



    return (

        <div className={cx(

            "muse-product-image flex w-full items-center justify-center overflow-hidden rounded-2xl bg-white/[0.04] p-5",

            large ? "min-h-72" : "h-44"

        )}>

            <img

                src={image}

                alt={product?.name || "Product"}

                onError={() => setFailed(true)}

                className={cx(

                    "muse-product-image-art max-w-full object-contain transition-transform duration-700 ease-out",

                    large ? "max-h-80" : "max-h-36"

                )}

            />

        </div>

    );

}



function Metric({ label, value, detail }) {

    return (

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">

            <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>

            <p className="mt-2 text-xl font-bold text-white">{value}</p>

            {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}

        </div>

    );

}



function ActivityTimeline({ items = [] }) {

    const [expanded, setExpanded] = useState(true);



    return (

        <section className="rounded-3xl border border-white/10 bg-[#15131f] p-6 md:p-7">

            <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Agent execution trace</p>

                    <h2 className="mt-2 text-xl font-bold text-white">How MUSE made its decision</h2>

                    <p className="mt-1 text-sm text-gray-400">The shopping agent's plan, tool calls and result assembly.</p>

                </div>

                <button

                    type="button"

                    onClick={() => setExpanded((value) => !value)}

                    className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-violet-400/40 hover:text-white"

                >

                    {expanded ? "Hide timeline" : "Show timeline"}

                </button>

            </div>



            {expanded && (

                items.length ? (

                    <ol className="mt-7 space-y-5">

                        {items.map((item, index) => (

                            <li key={`${item.step || "step"}-${index}`} className="relative flex gap-4">

                                <div className="flex flex-col items-center">

                                    <span className={cx(

                                        "mt-1 h-3 w-3 shrink-0 rounded-full ring-4",

                                        item.status === "error" || item.status === "failed"

                                            ? "bg-rose-400 ring-rose-400/10"

                                            : item.status === "running"

                                                ? "bg-sky-400 ring-sky-400/10"

                                                : item.status === "skipped" || item.status === "not_applicable"

                                                    ? "bg-gray-500 ring-white/5"

                                                    : "bg-emerald-400 ring-emerald-400/10"

                                    )} />

                                    {index !== items.length - 1 && <span className="mt-2 h-full min-h-7 w-px bg-white/10" />}

                                </div>

                                <div className="min-w-0 flex-1 pb-1">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <p className="font-semibold text-white">{item.step || `Step ${index + 1}`}</p>

                                        <StatusPill status={item.status} />

                                        {item.timestamp && (

                                            <span className="text-xs text-gray-600">

                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}

                                            </span>

                                        )}

                                    </div>

                                    {item.detail && <p className="mt-1 text-sm leading-6 text-gray-400">{item.detail}</p>}

                                </div>

                            </li>

                        ))}

                    </ol>

                ) : (

                    <p className="mt-6 rounded-xl bg-white/[0.03] p-4 text-sm text-gray-400">

                        No execution trace was returned. Run a new search after updating the backend to see the agent's steps.

                    </p>

                )

            )}

        </section>

    );

}



function ComparisonPanel({ comparison }) {

    if (!comparison) return null;

    const ranked = comparison.ranked_products || [];



    return (

        <section className="mt-12">

            <SectionHeading

                eyebrow="Explainable ranking"

                title="Product comparison"

                description={comparison.comparison_reason || "Products are ranked against the information available in the catalogue."}

                right={comparison.winner_score != null ? (

                    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3">

                        <p className="text-xs text-violet-200">Top match score</p>

                        <p className="mt-1 text-2xl font-bold text-white">{comparison.winner_score}<span className="text-sm text-gray-400">/100</span></p>

                    </div>

                ) : null}

            />



            {comparison.compared_factors?.length > 0 && (

                <div className="mb-5 flex flex-wrap gap-2">

                    {comparison.compared_factors.map((factor, index) => {

                        const label =

                            typeof factor === "string"

                                ? factor

                                : factor?.factor || factor?.details || displayValue(factor);



                        return (

                            <span key={`${label}-${index}`} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-gray-300">

                                {label}

                            </span>

                        );

                    })}

                </div>

            )}



            {ranked.length > 0 ? (

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15131f]">

                    <div className="grid grid-cols-[minmax(0,1fr)_90px] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:grid-cols-[minmax(0,1fr)_110px_100px]">

                        <span>Ranked product</span>

                        <span className="text-right">Match score</span>

                        <span className="hidden text-right sm:block">Position</span>

                    </div>

                    <div className="divide-y divide-white/5">

                        {ranked.map((item, index) => (

                            <div key={`${item.id || item.name}-${index}`} className="grid grid-cols-[minmax(0,1fr)_90px] items-start gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_110px_100px]">

                                <div className="min-w-0">

                                    <p className="truncate font-semibold text-white">{item.name || "Unnamed product"}</p>

                                    {item.evidence?.length > 0 && (

                                        <ul className="mt-2 space-y-1">

                                            {item.evidence.slice(0, 3).map((evidence, i) => (

                                                <li key={i} className="text-xs text-emerald-300/80">+ {evidence}</li>

                                            ))}

                                        </ul>

                                    )}

                                    {item.missing_information?.length > 0 && (

                                        <p className="mt-2 text-xs text-amber-200/80">

                                            Missing: {item.missing_information.slice(0, 2).join(" · ")}

                                        </p>

                                    )}

                                </div>

                                <div className="text-right">

                                    <span className="text-lg font-bold text-violet-200">{item.score ?? "—"}</span>

                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">

                                        <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.max(0, Math.min(100, Number(item.score) || 0))}%` }} />

                                    </div>

                                </div>

                                <div className="hidden text-right sm:block">

                                    {index === 0

                                        ? <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Top match</span>

                                        : <span className="text-sm text-gray-500">#{index + 1}</span>}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            ) : (

                <p className="rounded-2xl border border-white/10 bg-[#15131f] p-5 text-sm text-gray-400">

                    Detailed ranking data is not available for this search.

                </p>

            )}

            <p className="mt-3 text-xs text-gray-500">

                Match scores are transparent heuristic scores calculated from available catalogue fields; they are not a trained prediction or a guarantee of product quality.

            </p>

        </section>

    );

}



function CompatibilityPanel({ data }) {

    if (!data) return null;

    return (

        <section className="rounded-2xl border border-white/10 bg-[#15131f] p-5">

            <div className="flex flex-wrap items-center justify-between gap-3">

                <h3 className="font-bold text-white">Device compatibility</h3>

                <StatusPill status={data.status} />

            </div>

            <p className="mt-3 text-sm text-gray-300">{data.message || "No compatibility explanation was returned."}</p>

            {data.device && <p className="mt-2 text-xs text-gray-500">Target device: {data.device}</p>}

            {data.confidence && <p className="mt-1 text-xs text-gray-500">Confidence: {data.confidence}</p>}

            {data.evidence?.length > 0 && (

                <ul className="mt-4 space-y-2">

                    {data.evidence.map((entry, index) => (

                        <li key={index} className="text-sm text-gray-400">• {typeof entry === "string" ? entry : displayValue(entry)}</li>

                    ))}

                </ul>

            )}

            {data.status === "inferred" && (

                <p className="mt-4 text-xs text-amber-200">

                    This is an inference from available connection information, not an explicit manufacturer compatibility confirmation.

                </p>

            )}

        </section>

    );

}



function SizePanel({ title, data }) {

    if (!data) return null;

    return (

        <section className="rounded-2xl border border-white/10 bg-[#15131f] p-5">

            <div className="flex flex-wrap items-center justify-between gap-3">

                <h3 className="font-bold text-white">{title}</h3>

                <StatusPill status={data.status} />

            </div>

            {data.recommended_size && (

                <p className="mt-4 text-3xl font-bold text-violet-200">{data.recommended_size}</p>

            )}

            {data.size && !data.recommended_size && (

                <p className="mt-4 text-3xl font-bold text-violet-200">{data.size}</p>

            )}

            <p className="mt-3 text-sm leading-6 text-gray-400">

                {data.message || data.fit_note || "No sizing recommendation was returned."}

            </p>

            {data.confidence && <p className="mt-2 text-xs text-gray-500">Confidence: {data.confidence}</p>}

            {Array.isArray(data.available_sizes) && data.available_sizes.length > 0 && (
                <p className="mt-2 text-xs text-gray-400">Available sizes: {data.available_sizes.join(", ")}</p>
            )}

            {data.missing_measurements?.length > 0 && (

                <p className="mt-2 text-xs text-amber-200">Needed: {data.missing_measurements.join(", ")}</p>

            )}

        </section>

    );

}



function BundlePanel({ data }) {

    if (!data) return null;

    const items = data.items || data.bundle_items || [];

    return (

        <section className="rounded-2xl border border-white/10 bg-[#15131f] p-5">

            <div className="flex flex-wrap items-center justify-between gap-3">

                <h3 className="font-bold text-white">Smart bundle</h3>

                <StatusPill status={data.status || (items.length ? "success" : "not_applicable")} />

            </div>

            <p className="mt-3 text-sm text-gray-400">{data.message || "Bundle information is not available for this product."}</p>

            {items.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <article key={`${item.store_id || item.id || item.name || "bundle"}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.035]">
                            <div className="flex h-36 items-center justify-center bg-white/[0.025] p-3">
                                {item.image || item.image_url ? (
                                    <img src={item.image || item.image_url} alt={item.name || item.title || "Bundle item"} className="h-full w-full object-contain" loading="lazy" />
                                ) : (
                                    <span className="text-4xl">🛍️</span>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-semibold text-white">{item.name || item.title || "Bundle item"}</p>
                                <p className="mt-1 text-xs capitalize text-gray-500">{item.category || item.subcategory || item.type || "Recommended item"}</p>
                                <p className="mt-3 text-base font-bold text-violet-200">{formatPrice(item.price, item.currency || data.currency || "INR")}</p>
                                {item.compatibility_status && <p className="mt-1 text-xs text-gray-500">Compatibility: {item.compatibility_status}</p>}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {(data.total_price != null || data.main_price != null) && (

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">

                    <span className="text-sm text-gray-400">Bundle total</span>

                    <span className="text-xl font-bold text-emerald-300">

                        {formatPrice(data.total_price ?? data.main_price, data.currency || "INR")}

                    </span>

                </div>

            )}

            {data.skipped_items?.length > 0 && (
                <p className="mt-3 text-xs text-amber-200">Not added because of the budget: {data.skipped_items.join(", ")}</p>
            )}

            {data.unknown_compatibility?.length > 0 && (

                <p className="mt-3 text-xs text-amber-200">

                    Some bundle items have unknown compatibility: {data.unknown_compatibility.map((item) => typeof item === "string" ? item : item.name).join(", ")}

                </p>

            )}

            {data.skipped_accessories?.length > 0 && (

                <p className="mt-2 text-xs text-gray-500">Skipped accessories: {data.skipped_accessories.map((item) => typeof item === "string" ? item : item.name).join(", ")}</p>

            )}

        </section>

    );

}



function ReviewsPanel({ data }) {

    if (!data) return null;

    const total = Number(data.total_reviews || 0);

    const positive = Number(data.positive_count || 0);

    const negative = Number(data.negative_count || 0);

    const neutral = Number(data.neutral_count || 0);

    const distribution = data.sentiment_distribution || {};

    const aspects = data.aspect_analysis || {};



    return (

        <section className="rounded-3xl border border-white/10 bg-[#15131f] p-6 md:p-7">

            <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Review intelligence</p>

                    <h2 className="mt-2 text-xl font-bold text-white">What the available reviews say</h2>

                </div>

                <StatusPill status={total ? "success" : "unavailable"} />

            </div>



            {total ? (

                <>

                    <div className="mt-6 grid gap-3 sm:grid-cols-4">

                        <Metric label="Reviews analysed" value={total} />

                        <Metric label="Positive" value={positive} />

                        <Metric label="Negative" value={negative} />

                        <Metric label="Neutral" value={neutral} />

                    </div>



                    {data.overall_sentiment && (

                        <p className="mt-4 text-sm text-gray-300">

                            Overall sentiment: <span className="font-semibold capitalize text-white">{String(data.overall_sentiment).replaceAll("_", " ")}</span>

                            {data.sentiment_score != null && ` · Score ${data.sentiment_score}`}

                        </p>

                    )}



                    {Object.keys(distribution).length > 0 && (

                        <div className="mt-5 space-y-3">

                            {Object.entries(distribution).map(([label, value]) => {

                                const count = Number(value) || 0;

                                const percent = count <= 1 && total > 1 ? count * 100 : (count / total) * 100;

                                return (

                                    <div key={label}>

                                        <div className="mb-1 flex justify-between text-xs text-gray-400">

                                            <span className="capitalize">{label}</span><span>{count}</span>

                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-white/10">

                                            <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}



                    {(data.positive_highlights?.length > 0 || data.recurring_complaints?.length > 0) && (

                        <div className="mt-6 grid gap-4 md:grid-cols-2">

                            {data.positive_highlights?.length > 0 && (

                                <div className="rounded-2xl bg-emerald-400/[0.06] p-4">

                                    <h3 className="font-semibold text-emerald-200">Common positives</h3>

                                    <ul className="mt-3 space-y-2 text-sm text-gray-300">

                                        {data.positive_highlights.map((item, index) => <li key={index}>+ {typeof item === "string" ? item : displayValue(item)}</li>)}

                                    </ul>

                                </div>

                            )}

                            {data.recurring_complaints?.length > 0 && (

                                <div className="rounded-2xl bg-amber-400/[0.06] p-4">

                                    <h3 className="font-semibold text-amber-200">Recurring complaints</h3>

                                    <ul className="mt-3 space-y-2 text-sm text-gray-300">

                                        {data.recurring_complaints.map((item, index) => <li key={index}>− {typeof item === "string" ? item : displayValue(item)}</li>)}

                                    </ul>

                                </div>

                            )}

                        </div>

                    )}



                    {Object.keys(aspects).length > 0 && (

                        <div className="mt-6">

                            <h3 className="font-semibold text-white">Aspect analysis</h3>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                {Object.entries(aspects).map(([aspect, value]) => (

                                    <div key={aspect} className="rounded-xl border border-white/10 p-3">

                                        <p className="text-sm font-medium capitalize text-white">{aspect.replaceAll("_", " ")}</p>

                                        <p className="mt-1 text-xs leading-5 text-gray-400">{displayValue(value)}</p>

                                    </div>

                                ))}

                            </div>

                        </div>

                    )}



                    {(data.positive_reviews?.length > 0 || data.negative_reviews?.length > 0) && (

                        <details className="mt-6 rounded-xl border border-white/10 p-4">

                            <summary className="cursor-pointer text-sm font-semibold text-gray-200">View review examples</summary>

                            <div className="mt-4 grid gap-4 md:grid-cols-2">

                                {data.positive_reviews?.length > 0 && (

                                    <div>

                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">Positive</p>

                                        {data.positive_reviews.slice(0, 5).map((review, index) => <p key={index} className="mb-2 text-sm text-gray-400">“{typeof review === "string" ? review : displayValue(review)}”</p>)}

                                    </div>

                                )}

                                {data.negative_reviews?.length > 0 && (

                                    <div>

                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-200">Negative</p>

                                        {data.negative_reviews.slice(0, 5).map((review, index) => <p key={index} className="mb-2 text-sm text-gray-400">“{typeof review === "string" ? review : displayValue(review)}”</p>)}

                                    </div>

                                )}

                            </div>

                        </details>

                    )}

                    {data.analysis_method && <p className="mt-4 text-xs text-gray-600">Analysis method: {String(data.analysis_method).replaceAll("_", " ")}</p>}

                    {data.is_sample_data && <p className="mt-2 text-xs text-amber-200">These are sample/demo review records, not verified retailer reviews.</p>}

                </>

            ) : (

                <p className="mt-5 rounded-xl bg-white/[0.03] p-4 text-sm leading-6 text-gray-400">

                    {data.message || "No review records are available for this product. CompatBuy will not borrow reviews from another product."}

                </p>

            )}

        </section>

    );

}



function Results() {

    const [result, setResult] = useState(() => {

        try {

            return JSON.parse(sessionStorage.getItem("compatbuy-result"));

        } catch {

            return null;

        }

    });

    const [followUpAnswer, setFollowUpAnswer] = useState("");
    const [followUpLoading, setFollowUpLoading] = useState(false);
    const [followUpError, setFollowUpError] = useState("");

    async function submitFollowUp(event) {
        event.preventDefault();
        const answer = followUpAnswer.trim();
        if (!answer || followUpLoading) return;

        const originalRequest = result?.original_request || result?.search_parameters?.query || "";
        if (!originalRequest) {
            setFollowUpError("I couldn't recover the original shopping request. Please start a new search.");
            return;
        }

        const isShoeQuestion = /foot length|shoe size/i.test(result?.follow_up_question || "");
        // Shoe sizing expects an explicit centimetre unit. Users often type
        // only the number (for example, 26), so normalise that safely here.
        const shoeMeasurement = isShoeQuestion
            ? (/\b(?:cm|centimetres?|inches?|inch|in)\b/i.test(answer)
                ? answer
                : `${answer} cm`)
            : answer;
        const continuedRequest = isShoeQuestion
            ? `${originalRequest}. My foot length is ${shoeMeasurement}.`
            : `${originalRequest}. My usual clothing size is ${answer}.`;

        setFollowUpLoading(true);
        setFollowUpError("");
        try {
            const response = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ request: continuedRequest }),
            });
            const payload = await response.json();
            if (!response.ok || payload.status !== "success") {
                throw new Error(payload.message || "Unable to continue the sizing conversation.");
            }
            const nextResult = {
                ...payload.recommendation,
                original_request: originalRequest,
            };
            sessionStorage.setItem("compatbuy-result", JSON.stringify(nextResult));
            setResult(nextResult);
            setFollowUpAnswer("");
        } catch (error) {
            setFollowUpError(error.message || "Unable to continue. Please try again.");
        } finally {
            setFollowUpLoading(false);
        }
    }

    const product = result?.recommended_product;

    const alternatives = Array.isArray(result?.alternatives) ? result.alternatives : [];

    const comparison = result?.product_comparison;

    const activity = Array.isArray(result?.agent_activity) ? result.agent_activity : [];



    const productIsSample = Boolean(product?.is_sample_data) ||

        String(product?.source || "").toLowerCase().includes("synthetic") ||

        String(product?.source || "").toLowerCase().includes("demo");



    const rankedAlternativeScores = useMemo(() => {

        const rows = comparison?.ranked_products || [];

        return new Map(rows.map((row) => [String(row.id), row.score]));

    }, [comparison]);



    if (!result) {

        return (

            <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0b0a12] px-6 text-center text-white">

                <span className="text-5xl">🛍️</span>

                <h1 className="text-3xl font-bold">No results found</h1>

                <p className="max-w-md text-gray-400">Start a shopping search to get a recommendation from MUSE.</p>

                <Link to="/" className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500">

                    Back to Home

                </Link>

            </div>

        );

    }



    if (!product) {

        // A sizing follow-up intentionally has no product yet. Render the
        // question here instead of falling through to the no-recommendation
        // screen, which would hide the form below.
        if (result.needs_user_input && result.follow_up_question) {
            const isShoeQuestion = /foot length|shoe size/i.test(result.follow_up_question);

            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0a12] px-6 py-12 text-white">
                    <div className="w-full max-w-2xl rounded-3xl border border-violet-300/20 bg-white/[0.035] p-7 text-center shadow-2xl shadow-violet-950/20 sm:p-10">
                        <span className="text-5xl" aria-hidden="true">{isShoeQuestion ? "👟" : "👕"}</span>
                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">MUSE needs one detail</p>
                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Let's find your fit.</h1>
                        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-gray-300">
                            {result.follow_up_question}
                        </p>

                        <form onSubmit={submitFollowUp} className="mx-auto mt-7 flex w-full max-w-lg flex-col gap-3 sm:flex-row">
                            <input
                                autoFocus
                                value={followUpAnswer}
                                onChange={(event) => setFollowUpAnswer(event.target.value)}
                                placeholder={isShoeQuestion ? "e.g. 26 cm" : "e.g. M, L or XL"}
                                aria-label="Your sizing answer"
                                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0c0b13] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-400"
                            />
                            <button
                                type="submit"
                                disabled={!followUpAnswer.trim() || followUpLoading}
                                className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {followUpLoading ? "Continuing..." : "Continue shopping →"}
                            </button>
                        </form>

                        {followUpError && <p role="alert" className="mt-4 text-sm text-rose-300">{followUpError}</p>}

                        <p className="mt-6 text-xs text-gray-500">
                            {result.summary || "Your answer helps personalise this search. Product-specific fit will only be verified when sizing information is available."}
                        </p>
                        <Link to="/" className="mt-6 inline-block text-sm text-violet-300 transition hover:text-white">
                            Start a different search
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#0b0a12] px-6 text-center text-white">
                <span className="text-5xl">🔎</span>
                <h1 className="text-3xl font-bold">No recommendation available</h1>
                <p className="max-w-lg text-gray-400">{result.summary || "We couldn't find products with enough comparable information for this request."}</p>
                {result.external_discoveries?.status && (
                    <p className="text-xs text-gray-500">External discovery status: {result.external_discoveries.status}</p>
                )}
                <Link to="/" className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500">
                    Try another search
                </Link>
            </div>
        );
    }



    return (

        <div className="muse-results min-h-screen bg-[#0b0a12] text-white">
            <style>{`
                .muse-results {
                    position: relative;
                    isolation: isolate;
                    background-image:
                      radial-gradient(ellipse at 12% 4%, rgba(124,58,237,.12), transparent 34%),
                      radial-gradient(ellipse at 88% 24%, rgba(168,85,247,.07), transparent 30%);
                }
                .muse-results main { position: relative; z-index: 1; }
                .muse-results .muse-product-card {
                    transform-style: preserve-3d;
                    transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease;
                }
                .muse-results .muse-product-card:hover {
                    transform: translateY(-7px);
                    border-color: rgba(167,139,250,.48);
                    box-shadow: 0 22px 55px rgba(76,29,149,.18);
                }
                .muse-results .muse-product-image img {
                    transition: transform .65s cubic-bezier(.2,.8,.2,1), filter .4s ease;
                }
                .muse-results .muse-product-card:hover img,
                .muse-results .muse-product-image:hover img {
                    transform: scale(1.09) rotate(-1deg);
                    filter: drop-shadow(0 16px 24px rgba(139,92,246,.18));
                }
                .muse-results section {
                    animation: muse-section-in .65s cubic-bezier(.2,.8,.2,1) both;
                }
                .muse-results section:nth-of-type(2) { animation-delay: .06s; }
                .muse-results section:nth-of-type(3) { animation-delay: .12s; }
                .muse-results button, .muse-results a {
                    -webkit-tap-highlight-color: transparent;
                }
                @keyframes muse-section-in {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .muse-results section { animation: none; }
                    .muse-results .muse-product-card,
                    .muse-results .muse-product-image img { transition: none; }
                }
            `}</style>

            <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-12">

                <Link to="/" className="text-sm text-violet-300 transition hover:text-white">

                    ← Back to search

                </Link>



                <header className="mt-8">

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">

                        ✦ MUSE · Shopping intelligence

                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">

                        Your match is ready.

                    </h1>

                    <p className="mt-4 max-w-3xl leading-7 text-gray-400">

                        {result.summary || "Here is the product that best matches the available information in your request."}

                    </p>

                </header>



                {/* Recommended product */}

                <section className="mt-9 overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#211a35] via-[#171323] to-[#11101a] p-5 md:p-9">

                    <div className="flex flex-wrap items-center justify-between gap-3">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">✦ Recommended product</p>

                        <div className="flex flex-wrap gap-2">

                            {productIsSample && <StatusPill status="unknown" />}

                            {comparison?.winner_score != null && (

                                <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-semibold text-violet-200">

                                    {comparison.winner_score}/100 match

                                </span>

                            )}

                        </div>

                    </div>



                    <div className="mt-7 grid gap-8 md:grid-cols-[1fr_1fr]">

                        <ProductImage product={product} large />

                        <div className="flex flex-col justify-center">

                            <p className="text-sm font-medium text-violet-300">{product.brand || product.category || "Selected product"}</p>

                            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{product.name || "Recommended product"}</h2>

                            {product.description && <p className="mt-4 leading-7 text-gray-400">{product.description}</p>}



                            <p className="mt-6 text-3xl font-bold text-emerald-300">

                                {formatPrice(product.price, product.currency || "INR")}

                            </p>

                            <WishlistButton product={product} />

                            {product.rating != null && (

                                <p className="mt-2 text-sm text-gray-400">★ {product.rating} catalogue rating</p>

                            )}



                            <div className="mt-5 flex flex-wrap gap-2 text-xs">

                                {product.category && <span className="rounded-full bg-white/10 px-3 py-1.5 text-gray-300">{product.category}</span>}

                                {product.availability && <span className="rounded-full bg-white/10 px-3 py-1.5 text-gray-300">Catalogue availability: {product.availability}</span>}

                                {product.source && <span className="rounded-full bg-white/10 px-3 py-1.5 text-gray-300">Source: {product.source}</span>}

                            </div>

                            {Array.isArray(product.available_sizes) && product.available_sizes.length > 0 && (
                                <div className="mt-5">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Available sizes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.available_sizes.map((size) => (
                                            <span key={size} className="rounded-lg border border-violet-300/20 bg-violet-300/[0.07] px-3 py-1.5 text-sm text-violet-100">
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}



                            {productIsSample && (

                                <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-200">

                                    Demo/sample catalogue entry. Price and availability are not verified live retailer information.

                                </p>

                            )}

                        </div>

                    </div>

                </section>



                {/* Agent activity */}

                <div className="mt-8">

                    <ActivityTimeline items={activity} />

                </div>



                {/* Product comparison */}

                <ComparisonPanel comparison={comparison} />



                {/* Specialist intelligence */}

                <section className="mt-12">

                    <SectionHeading

                        eyebrow="Beyond product search"

                        title="Product intelligence"

                        description="Specialist checks run only when the selected product has relevant data. Unknown information is shown as unknown rather than guessed."

                    />

                    <div className="grid gap-4 lg:grid-cols-2">

                        <CompatibilityPanel data={result.compatibility} />

                        <SizePanel title="Shoe size recommendation" data={result.shoe_size_recommendation} />

                        <SizePanel title="Clothing size recommendation" data={result.clothing_size_recommendation} />

                        <BundlePanel data={result.bundle} />

                    </div>

                </section>



                {/* Reviews */}

                <div className="mt-12">

                    <ReviewsPanel data={result.review_insights} />

                </div>



                {/* Alternatives */}

                <section className="mt-12">

                    <SectionHeading

                        eyebrow="Explore your options"

                        title="Other products to consider"

                        description="Alternatives are kept in the comparison engine's ranking order."

                        right={<span className="text-sm text-gray-500">{alternatives.length} alternative{alternatives.length === 1 ? "" : "s"}</span>}

                    />



                    {alternatives.length ? (

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {alternatives.map((item, index) => {

                                const score = rankedAlternativeScores.get(String(item.id));

                                const sample = Boolean(item.is_sample_data) ||

                                    String(item.source || "").toLowerCase().includes("synthetic") ||

                                    String(item.source || "").toLowerCase().includes("demo");

                                return (

                                    <article key={`${item.id || item.name}-${index}`} className="muse-product-card rounded-2xl border border-white/10 bg-[#15131f] p-4 transition hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-xl hover:shadow-violet-950/30">

                                        <ProductImage product={item} />

                                        <div className="mt-4 flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <h3 className="font-bold text-white">{item.name || "Alternative product"}</h3>

                                                <p className="mt-1 text-sm text-gray-500">{item.brand || item.category || "Catalogue item"}</p>

                                            </div>

                                            {score != null && <span className="shrink-0 rounded-lg bg-violet-400/10 px-2 py-1 text-xs font-semibold text-violet-200">{score}/100</span>}

                                        </div>

                                        <p className="mt-4 text-xl font-bold text-violet-200">{formatPrice(item.price, item.currency || "INR")}</p>\n                                        <WishlistButton product={item} />

                                        {item.rating != null && <p className="mt-1 text-xs text-gray-500">★ {item.rating} catalogue rating</p>}

                                        {sample && <p className="mt-3 text-xs text-amber-200">Sample/demo catalogue data</p>}

                                    </article>

                                );

                            })}

                        </div>

                    ) : (

                        <div className="rounded-2xl border border-white/10 bg-[#15131f] p-6 text-sm text-gray-400">

                            No additional comparable products were found for this search.

                        </div>

                    )}

                </section>



                {/* Decision explanation */}

                {Array.isArray(result.reasoning) && result.reasoning.length > 0 && (

                    <section className="mt-12 rounded-3xl border border-white/10 bg-[#15131f] p-6 md:p-7">

                        <SectionHeading

                            eyebrow="Decision transparency"

                            title="Why this recommendation?"

                            description="A concise explanation of the evidence and decisions used by the shopping agent."

                        />

                        <ol className="space-y-3">

                            {result.reasoning.map((reason, index) => (

                                <li key={index} className="flex gap-3 text-sm leading-6 text-gray-300">

                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-xs font-bold text-violet-200">{index + 1}</span>

                                    <span>{typeof reason === "string" ? reason : displayValue(reason)}</span>

                                </li>

                            ))}

                        </ol>

                    </section>

                )}



                {/* Follow-up and source disclaimer */}

                {result.needs_user_input && result.follow_up_question && (

                    <section className="mt-8 rounded-2xl border border-violet-300/20 bg-violet-300/[0.06] p-5">

                        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">One detail needed</p>

                        <p className="mt-2 text-white">{result.follow_up_question}</p>

                        <form onSubmit={submitFollowUp} className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <input
                                value={followUpAnswer}
                                onChange={(event) => setFollowUpAnswer(event.target.value)}
                                placeholder={/foot length|shoe size/i.test(result.follow_up_question) ? "e.g. 26 cm" : "e.g. M, L or XL"}
                                aria-label="Your sizing answer"
                                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0c0b13] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-400"
                            />
                            <button
                                type="submit"
                                disabled={!followUpAnswer.trim() || followUpLoading}
                                className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {followUpLoading ? "Continuing..." : "Continue shopping →"}
                            </button>
                        </form>
                        {followUpError && <p role="alert" className="mt-3 text-sm text-rose-300">{followUpError}</p>}

                    </section>

                )}



                {(result.data_disclaimer || result.external_discoveries) && (

                    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Data transparency</p>

                        <p className="mt-2 text-xs leading-6 text-gray-500">

                            {result.data_disclaimer || "Product information depends on the connected catalogue sources and may not represent live retailer stock or current prices."}

                        </p>

                        {result.external_discoveries?.source && (

                            <p className="mt-2 text-xs text-gray-600">

                                External discovery source: {result.external_discoveries.source} · API status: {result.external_discoveries.status || "unknown"} · Returned: {result.external_discoveries.total_results ?? 0}

                            </p>

                        )}

                    </section>

                )}



                <div className="mt-12 flex justify-center pb-8">

                    <Link

                        to="/"

                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-4 font-semibold transition hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"

                    >

                        Start another search <span className="ml-2">→</span>

                    </Link>

                </div>

            </main>

        </div>

    );

}



export default Results;


