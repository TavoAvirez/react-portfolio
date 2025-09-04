import { useCallback, useEffect, useReducer, useRef, useState, type WheelEvent } from "react";
import EvolutionHoverCard from "../components/Pokedex/EvolutionHoverCard";
import '../styles/PokeAPI.css';
import '../styles/Theme.css'

type Pokemon = {
    id: number;
    name: string;
    image: string;
};

type PokemonFilter = {
    page: number;
    pageTotal: number;
    limit: number;
    offset: number;
}

type PageAction =
    | { type: 'NEXT' }
    | { type: 'PREV' }
    | { type: 'SET_PAGE'; page: number }
    | { type: 'SET_TOTAL'; total: number }
    | { type: 'SET_LIMIT'; limit: number };

function paginationReducer(state: PokemonFilter, action: PageAction): PokemonFilter {
    switch (action.type) {
        case 'NEXT': {
            const page = Math.min(state.page + 1, state.pageTotal || state.page + 1);
            return { ...state, page, offset: getOffset(page, state.limit) };
        }
        case 'PREV': {
            const page = Math.max(state.page - 1, 1);
            return { ...state, page, offset: getOffset(page, state.limit) };
        }
        case 'SET_PAGE': {
            const page = clampPage(action.page, state.pageTotal);
            return { ...state, page, offset: getOffset(page, state.limit) };
        }
        case 'SET_TOTAL': {
            const pageTotal = Math.ceil(action.total / state.limit);
            // clamp la página actual si el total cambia
            const page = clampPage(state.page, pageTotal);
            return { ...state, pageTotal, page, offset: getOffset(page, state.limit) };
        }
        case 'SET_LIMIT': {
            const limit = Math.max(1, action.limit);
            const pageTotal = state.pageTotal ? Math.ceil((state.pageTotal * state.limit) / limit) : state.pageTotal;
            const page = clampPage(state.page, pageTotal || state.page);
            return { ...state, limit, page, pageTotal, offset: getOffset(page, limit) };
        }
        default:
            return state;
    }
}

// Helpers
function getOffset(page: number, limit: number) {
    return page * limit - limit;
}
function clampPage(n: number, total: number) {
    return Math.min(Math.max(n, 1), Math.max(total, 1));
}
function extractIdFromUrl(url: string) {
    return Number(url.split("/").filter(Boolean).pop());
}

function PokeAPI() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [totalPokemons, setTotalPokemons] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, dispatch] = useReducer(paginationReducer, { page: 1, pageTotal: 0, limit: 30, offset: 0 });
    const [pageInput, setPageInput] = useState<string>("1");
    const [pageError, setPageError] = useState<string | null>(null);

    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const anchors = useRef<Record<number, HTMLDivElement | null>>({});

    // Evita que la rueda del mouse cambie el valor del input numérico
    function handleWheel(e: WheelEvent<HTMLInputElement>) {
        e.preventDefault();
        (e.currentTarget as HTMLInputElement).blur();
    }

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${filter.limit}&offset=${filter.offset}`, { signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // Transform results: extract id from URL and build official artwork URL
                const items: Pokemon[] = data.results.map((p: { name: string; url: string }) => {
                    const id = extractIdFromUrl(p.url);
                    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                    return { id, name: p.name, image };
                });

                setPokemons(items);
                setTotalPokemons(data.count);
                // Update page total via reducer
                dispatch({ type: 'SET_TOTAL', total: data.count });
            } catch (err: unknown) {
                if ((err as any)?.name === "AbortError") return;
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        load();

        // Cleanup: abort fetch if component unmounts
        return () => controller.abort();
    }, [filter.page, filter.limit, filter.offset]);

    // Sincroniza el input con la página actual
    useEffect(() => {
        setPageInput(String(filter.page));
        setPageError(null);
    }, [filter.page]);

    const nextPage = useCallback(() => {
        dispatch({ type: 'NEXT' });
    }, []);

    const previousPage = useCallback(() => {
        dispatch({ type: 'PREV' });
    }, []);

    const applyPage = useCallback((value: string) => {
        const trimmed = value.trim();
        if (trimmed === "") {
            setPageError("Required");
            return;
        }
        const n = Number.parseInt(trimmed, 10);
        if (!Number.isFinite(n)) {
            setPageError("Enter a valid number");
            return;
        }
        if (filter.pageTotal <= 0) return;
        const page = clampPage(n, filter.pageTotal);
        setPageInput(String(page));
        setPageError(null);
        if (page === filter.page) return;
        dispatch({ type: 'SET_PAGE', page });
    }, [filter.page, filter.pageTotal]);

    if (loading) {
        const skeletons = Array.from({ length: filter.limit }, (_, i) => i);
        return (
            <div style={{ padding: 16 }}>
                <h1>Pokédex</h1>
                <small className="mb-3">Browse Pokémon with pagination. Use the controls to navigate pages or jump to a specific page. Powered by PokeAPI</small>
                <ul className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 list-unstyled m-0">
                    {skeletons.map((i) => (
                        <li key={i} className="col">
                            <div className="card h-100 text-center shadow-sm">
                                <div className="p-3">
                                    <div className="skeleton" style={{ height: 120, borderRadius: 8 }} />
                                </div>
                                <div className="card-body py-2">
                                    <span className="badge text-bg-light border me-1">---</span>
                                    <div className="skeleton" style={{ height: 16, width: "60%", margin: "0 auto", borderRadius: 4 }} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    if (error) return <p style={{ padding: 16 }}>Error: {error}</p>;

    const startIndex = filter.offset + 1;
    const endIndex = filter.offset + pokemons.length;

    return (
        <div style={{ padding: 16 }}>
            <h1>Pokédex</h1>
            <p className="mb-3">Browse Pokémon with pagination. Use the controls to navigate pages or jump to a specific page. Powered by <a href="https://pokeapi.co/">PokeAPI</a></p>

            {/* Top bar: summary + compact pagination (visual emphasis) */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className=" small" >
                    Showing {startIndex}–{endIndex} of {totalPokemons} · {filter.limit} per page
                </div>
                <nav aria-label="Top Pokédex pagination">
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${filter.page === 1 ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={previousPage} aria-label="Previous" disabled={filter.page === 1}>
                                «
                            </button>
                        </li>
                        <li className="page-item active" aria-current="page">
                            <span className="page-link">{filter.page}</span>
                        </li>
                        <li className={`page-item ${filter.page === filter.pageTotal ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={nextPage} aria-label="Next" disabled={filter.page === filter.pageTotal}>
                                »
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            {/* cards for pokemons */}
            <ul className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 list-unstyled m-0">
                {pokemons.map((p) => (
                    <li key={p.id} className="col"
                        onMouseEnter={() => setHoveredId(p.id)}
                        onMouseLeave={() => setHoveredId(prev => prev === p.id ? null : prev)}
                    >
                        <div className="card h-100 text-center shadow-sm" ref={(el) => { anchors.current[p.id] = el; }}>
                            <div className="p-3">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="img-fluid mx-auto d-block"
                                    style={{ height: 120, objectFit: 'contain' }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="card-body py-2">
                                <span className="badge text-bg-light border me-1">#{p.id}</span>
                                <h6 className="card-title text-capitalize mb-0">{p.name}</h6>
                            </div>
                        </div>
                        <EvolutionHoverCard
                            pokemonId={p.id}
                            visible={hoveredId === p.id}
                            anchorEl={anchors.current[p.id]}
                        />
                    </li>
                ))}
            </ul>

            {/* Bottom bar: full-width pagination */}
            <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="small">
                    Page {filter.page} of {filter.pageTotal}
                </div>
                <nav aria-label="Bottom Pokédex pagination">
                    <ul className="pagination mb-0">
                        <li className={`page-item ${filter.page === 1 ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={previousPage} disabled={filter.page === 1}>
                                Previous
                            </button>
                        </li>
                        <li className="page-item" aria-current="page">
                            <div className="input-group" style={{ width: 150 }}>
                                <span className="input-group-text">Go to</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={Math.max(filter.pageTotal, 1)}
                                    className={`form-control ${pageError ? 'is-invalid' : ''}`}
                                    value={pageInput}
                                    onWheel={handleWheel}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setPageInput(v);
                                        const n = Number.parseInt(v, 10);
                                        if (v === "") setPageError("Required");
                                        else if (!Number.isFinite(n)) setPageError("Enter a valid number");
                                        else if (n < 1) setPageError("Minimum 1");
                                        else if (filter.pageTotal > 0 && n > filter.pageTotal) setPageError(`Maximum ${filter.pageTotal}`);
                                        else setPageError(null);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') applyPage(pageInput); }}
                                    onBlur={() => applyPage(pageInput)}
                                    aria-label="Go to page"
                                />
                                <span className="input-group-text">/ {filter.pageTotal || 1}</span>
                                {pageError && <div className="invalid-feedback">{pageError}</div>}
                            </div>
                        </li>
                        <li className={`page-item ${filter.page === filter.pageTotal ? 'disabled' : ''}`}>
                            <button type="button" className="page-link" onClick={nextPage} disabled={filter.page === filter.pageTotal}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default PokeAPI;
