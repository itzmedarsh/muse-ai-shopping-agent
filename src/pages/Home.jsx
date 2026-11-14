import { useState } from "react";



const categories = [

    { name: "Fashion", icon: "👟", query: "sneakers" },

    { name: "Audio", icon: "🎧", query: "headphones" },

    { name: "Storage", icon: "💾", query: "SSD" },

    { name: "Accessories", icon: "⌨️", query: "keyboard" },

];



const suggestions = [

    "Find black sneakers under ₹3,000",

    "Find an SSD for my MacBook M1",

    "Recommend wireless headphones",

];



const floatingProducts = [

    {

        name: "Premium Audio",

        label: "Discover sound",

        image:

            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",

        className: "float-one",

    },

    {

        name: "Sneakers",

        label: "Find your fit",

        image:

            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",

        className: "float-two",

    },

    {

        name: "Smart Tech",

        label: "Compare smarter",

        image:

            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",

        className: "float-three",

    },

];



function Home() {

    const [request, setRequest] = useState("");

    const [activeCategory, setActiveCategory] = useState("All");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    function chooseCategory(category) {

        setActiveCategory(category.name);

        setRequest(`Find ${category.query}`);



        document.getElementById("shopping-search")?.scrollIntoView({

            behavior: "smooth",

        });

    }



    async function handleSearch(event) {

        event.preventDefault();



        if (!request.trim() || loading) return;



        setLoading(true);

        setMessage("MUSE is analysing your shopping request...");



        try {

            const response = await fetch("/api/search", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({ request: request.trim() }),

            });



            const data = await response.json();



            if (!response.ok) {

                throw new Error(data.message || "Shopping search failed.");

            }



            sessionStorage.setItem(

                "compatbuy-result",

                JSON.stringify(data.recommendation)

            );



            window.location.href = "/results";

        } catch (error) {

            setMessage(error.message || "Unable to connect to MUSE.");

        } finally {

            setLoading(false);

        }

    }



    return (

        <div className="muse-home min-h-screen overflow-hidden bg-[#090811] text-white">

            <style>{`

        .muse-home {

          \--muse-purple: #a78bfa;

        }



        .muse-home \* {

          box-sizing: border-box;

        }



        .muse-nav-link {

          position: relative;

          transition: color .25s ease;

        }



        .muse-nav-link::after {

          content: "";

          position: absolute;

          bottom: -7px;

          left: 0;

          width: 0;

          height: 2px;

          background: #a78bfa;

          transition: width .3s ease;

        }



        .muse-nav-link:hover {

          color: white;

        }



        .muse-nav-link:hover::after {

          width: 100%;

        }



        .muse-orb {

          position: absolute;

          border-radius: 9999px;

          filter: blur(85px);

          pointer-events: none;

          animation: orbPulse 7s ease-in-out infinite alternate;

        }



        @keyframes orbPulse {

          from { transform: scale(.85); opacity: .35; }

          to { transform: scale(1.2); opacity: .7; }

        }



        .muse-hero {

          animation: heroEnter .9s ease both;

        }



        @keyframes heroEnter {

          from { opacity: 0; transform: translateY(25px); }

          to { opacity: 1; transform: translateY(0); }

        }



        .muse-gradient-text {

          background: linear-gradient(

            100deg,

            \#c4b5fd,

            \#a78bfa,

            \#e879f9,

            \#c4b5fd

          );

          background-size: 250% auto;

          -webkit-background-clip: text;

          background-clip: text;

          color: transparent;

          animation: gradientMove 6s linear infinite;

        }



        @keyframes gradientMove {

          to { background-position: 250% center; }

        }



        .floating-product {

          position: absolute;

          width: 190px;

          overflow: hidden;

          border: 1px solid rgba(255,255,255,.14);

          border-radius: 23px;

          background: rgba(25,22,39,.85);

          box-shadow: 0 20px 70px rgba(0,0,0,.4);

          backdrop-filter: blur(16px);

          transition: transform .4s ease, border-color .4s ease, box-shadow .4s ease;

          cursor: pointer;

        }



        .floating-product:hover {

          transform: translateY(-14px) scale(1.08) rotate(0deg) !important;

          border-color: rgba(167,139,250,.8);

          box-shadow: 0 25px 70px rgba(139,92,246,.25);

          z-index: 20;

        }



        .floating-product img {

          width: 100%;

          height: 125px;

          object-fit: cover;

          transition: transform .6s ease;

        }



        .floating-product:hover img {

          transform: scale(1.13);

        }



        .float-one {

          top: 5%;

          right: 12%;

          transform: rotate(-8deg);

          animation: floatOne 6s ease-in-out infinite;

        }



        .float-two {

          top: 42%;

          right: 0;

          transform: rotate(7deg);

          animation: floatTwo 7s ease-in-out infinite;

          animation-delay: -2s;

        }



        .float-three {

          bottom: 0;

          right: 33%;

          transform: rotate(-5deg);

          animation: floatThree 6.5s ease-in-out infinite;

          animation-delay: -3s;

        }



        @keyframes floatOne {

          0%,100% { translate: 0 0; }

          50% { translate: 0 -22px; }

        }



        @keyframes floatTwo {

          0%,100% { translate: 0 0; }

          50% { translate: 0 20px; }

        }



        @keyframes floatThree {

          0%,100% { translate: 0 0; }

          50% { translate: 0 -17px; }

        }



        .muse-category {

          transition: transform .35s ease, border-color .35s ease, background .35s ease, box-shadow .35s ease;

          transform-style: preserve-3d;

        }



        .muse-category:hover {

          transform: translateY(-10px) scale(1.025);

          border-color: rgba(167,139,250,.65);

          background: rgba(139,92,246,.13);

          box-shadow: 0 20px 45px rgba(109,40,217,.15);

        }



        .muse-category-icon {

          display: inline-block;

          transition: transform .4s cubic-bezier(.2,.8,.2,1);

        }



        .muse-category:hover .muse-category-icon {

          transform: scale(1.3) rotate(-12deg);

        }



        .muse-feature {

          transition: transform .35s ease, border-color .35s ease, background .35s ease;

        }



        .muse-feature:hover {

          transform: translateY(-8px);

          border-color: rgba(167,139,250,.5);

          background: rgba(139,92,246,.1);

        }



        .muse-search-button {

          transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;

        }



        .muse-search-button:hover:not(:disabled) {

          transform: translateY(-3px) scale(1.025);

          box-shadow: 0 12px 35px rgba(139,92,246,.35);

          filter: brightness(1.12);

        }



        .muse-search-button:active:not(:disabled) {

          transform: scale(.97);

        }



        .muse-chip {

          transition: all .25s ease;

        }



        .muse-chip:hover {

          transform: translateY(-3px);

          border-color: rgba(167,139,250,.65);

          background: rgba(139,92,246,.15);

          color: white;

        }



        .muse-status-dot {

          animation: statusPulse 1.8s ease-in-out infinite;

        }



        @keyframes statusPulse {

          0%,100% { box-shadow: 0 0 0 0 rgba(52,211,153,.5); }

          50% { box-shadow: 0 0 0 7px rgba(52,211,153,0); }

        }



        @media (max-width: 900px) {

          .muse-visual {

            opacity: .32;

            position: absolute;

            inset: 0;

            pointer-events: none;

          }



          .floating-product {

            width: 130px;

          }



          .floating-product img {

            height: 90px;

          }



          .float-one { right: 8%; }

          .float-two { right: 0; top: 50%; }

          .float-three { right: 32%; bottom: 0; }

        }



        @media (max-width: 600px) {

          .muse-visual { display: none; }

        }



        @media (prefers-reduced-motion: reduce) {

          .muse-home \*, .muse-home \*::before, .muse-home \*::after {

            animation-duration: .01ms !important;

            animation-iteration-count: 1 !important;

            transition-duration: .01ms !important;

          }

        }

      `}</style>

            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090811]/85 backdrop-blur-2xl">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <a href="/" className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-700 text-xl font-black shadow-lg shadow-violet-900/40 transition duration-300 hover:rotate-12 hover:scale-110">

                            M

                        </div>

                        <span className="text-2xl font-bold tracking-tight">

                            MUSE<span className="text-violet-400">.</span>

                        </span>

                    </a>



                    <nav className="hidden items-center gap-9 text-sm text-gray-400 md:flex">

                        <a href="#home" className="muse-nav-link">Home</a>

                        <a href="#categories" className="muse-nav-link">Categories</a>

                        <a href="#explore" className="muse-nav-link">About</a>

                    </nav>



                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-xs text-emerald-300">

                        <span className="muse-status-dot h-2 w-2 rounded-full bg-emerald-400" />

                        AI Online

                    </div>

                </div>

            </header>



            <main className="mx-auto max-w-7xl px-6">


                <section id="home" className="relative flex min-h-[640px] items-center py-20 md:py-24">

                    <div className="muse-orb right-0 top-10 h-96 w-96 bg-violet-700/30" />

                    <div className="muse-orb bottom-0 left-10 h-64 w-64 bg-fuchsia-700/20" />



                    <div className="muse-hero relative z-10 max-w-2xl">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">

                            ✦ INTRODUCING MUSE

                        </div>



                        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">

                            Shopping, made

                            <span className="muse-gradient-text block">

                                intelligently personal.

                            </span>

                        </h1>



                        <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">

                            Meet your personal AI shopping agent. MUSE discovers products,

                            compares options, checks compatibility and helps you make

                            smarter buying decisions.

                        </p>



                        <div className="mt-9 flex flex-wrap gap-3 text-sm">

                            {[

                                "Smart discovery",

                                "Product comparison",

                                "Compatibility checks",

                                "Personalised sizing",

                            ].map((item) => (

                                <span key={item} className="muse-chip rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-300">

                                    ✦ {item}

                                </span>

                            ))}

                        </div>



                        <button

                            onClick={() =>

                                document.getElementById("shopping-search")?.scrollIntoView({

                                    behavior: "smooth",

                                })

                            }

                            className="muse-search-button mt-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-4 font-semibold shadow-lg shadow-violet-900/30"

                        >

                            Explore intelligent shopping →

                        </button>

                    </div>

                    <div className="muse-visual absolute inset-0">

                        {floatingProducts.map((product) => (

                            <div

                                key={product.name}

                                className={`floating-product ${product.className}`}

                            >

                                <img src={product.image} alt={product.name} />

                                <div className="p-3">

                                    <p className="text-sm font-bold">{product.name}</p>

                                    <p className="mt-1 text-xs text-violet-300">{product.label}</p>

                                </div>

                            </div>

                        ))}



                        <div className="absolute right-[25%] top-[36%] flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10 text-3xl shadow-2xl shadow-violet-500/20 backdrop-blur-xl">

                            ✦

                        </div>

                    </div>

                </section>


                <section id="shopping-search" className="scroll-mt-28 py-12">

                    <form

                        onSubmit={handleSearch}

                        className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#191526] to-[#11101a] p-6 shadow-2xl shadow-violet-950/20 md:p-9"

                    >

                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/15 blur-[80px]" />



                        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">

                            <div>

                                <p className="text-xs font-bold tracking-[0.2em] text-violet-300">

                                    ✦ POWERED BY MUSE AI

                                </p>

                                <h2 className="mt-2 text-2xl font-bold">

                                    What are we shopping for?

                                </h2>

                                <p className="mt-2 text-sm text-gray-400">

                                    Describe what you need in your own words.

                                </p>

                            </div>



                            <span className="rounded-full bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">

                                ● Ready to assist

                            </span>

                        </div>



                        <textarea

                            value={request}

                            onChange={(event) => setRequest(event.target.value)}

                            placeholder="Example: Find wireless headphones under ₹4,000 compatible with my iPhone 15 Pro Max..."

                            rows={4}

                            className="relative z-10 w-full resize-y rounded-2xl border border-white/10 bg-[#0c0b13] p-5 text-white outline-none transition duration-300 placeholder:text-gray-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"

                        />



                        <div className="relative z-10 mt-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

                            <span className="text-xs text-gray-500">

                                Natural language · Agentic AI · Smart recommendations

                            </span>



                            <button

                                type="submit"

                                disabled={loading || !request.trim()}

                                className="muse-search-button rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-7 py-3.5 font-semibold shadow-lg shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-50"

                            >

                                {loading ? "MUSE is thinking..." : "Find my products →"}

                            </button>

                        </div>



                        {message && (

                            <p role="status" className="relative z-10 mt-4 text-sm text-violet-300">

                                {message}

                            </p>

                        )}

                    </form>



                    <div className="mt-6">

                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">

                            Try asking

                        </p>



                        <div className="flex flex-wrap gap-3">

                            {suggestions.map((item) => (

                                <button

                                    key={item}

                                    onClick={() => setRequest(item)}

                                    className="muse-chip rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300"

                                >

                                    {item}

                                </button>

                            ))}

                        </div>

                    </div>

                </section>





                <section id="categories" className="py-20">

                    <div className="mb-8">

                        <p className="text-xs font-bold tracking-widest text-violet-300">

                            DISCOVER YOUR INTERESTS

                        </p>

                        <h2 className="mt-3 text-3xl font-bold">Explore Categories</h2>

                        <p className="mt-2 text-sm text-gray-400">

                            What are you looking for today?

                        </p>

                    </div>



                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                        {categories.map((category) => (

                            <button

                                key={category.name}

                                onClick={() => chooseCategory(category)}

                                className={`muse-category group relative overflow-hidden rounded-2xl border p-7 text-left ${activeCategory === category.name

                                    ? "border-violet-400 bg-violet-500/10"

                                    : "border-white/10 bg-[#13121d]"

                                    }`}

                            >

                                <span className="muse-category-icon text-5xl">

                                    {category.icon}

                                </span>



                                <h3 className="mt-7 text-lg font-bold">{category.name}</h3>

                                <p className="mt-2 text-xs text-gray-500">

                                    Explore {category.name.toLowerCase()}

                                </p>



                                <span className="absolute right-5 top-5 text-violet-300 transition duration-300 group-hover:translate-x-2 group-hover:-translate-y-2">

                                    ↗

                                </span>

                            </button>

                        ))}

                    </div>

                </section>




                <section id="explore" className="border-t border-white/10 py-16">

                    <p className="text-xs font-bold tracking-widest text-violet-300">

                        WHY MUSE?

                    </p>



                    <h2 className="mt-3 text-3xl font-bold">

                        More than product search.

                    </h2>



                    <p className="mt-3 max-w-xl text-gray-400">

                        An intelligent shopping experience that evaluates your needs

                        before helping you make a decision.

                    </p>



                    <div className="mt-10 grid gap-5 md:grid-cols-3">

                        {[

                            ["⌕", "Intelligent discovery", "Find products based on natural language requirements."],

                            ["⇄", "Smart comparison", "Evaluate prices and available specifications before choosing."],

                            ["✦", "Personalised shopping", "Get compatibility checks, review insights and size recommendations."],

                        ].map(([icon, title, description]) => (

                            <article

                                key={title}

                                className="muse-feature rounded-2xl border border-white/10 bg-[#13121d] p-7"

                            >

                                <span className="text-4xl text-violet-300">{icon}</span>

                                <h3 className="mt-6 text-lg font-bold">{title}</h3>

                                <p className="mt-3 text-sm leading-6 text-gray-400">

                                    {description}

                                </p>

                            </article>

                        ))}

                    </div>

                </section>



                <footer className="border-t border-white/10 py-8 text-center text-xs text-gray-500">

                    © 2026 MUSE · Discover better. Compare smarter. Buy confidently.

                </footer>

            </main>

        </div>

    );

}



export default Home;
