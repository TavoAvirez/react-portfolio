import { useEffect, useRef, useState } from "react";

type EvoItem = { id: number; name: string; image: string };
type EvolutionData = { chain: EvoItem[] };

// Cache en memoria para evitar refetch de la misma cadena
const evoCache = new Map<number, EvolutionData>();

type EvolutionHoverCardProps = {
  pokemonId: number;
  visible: boolean;
  anchorEl: HTMLElement | null;
};

function EvolutionHoverCard({ pokemonId, visible, anchorEl }: EvolutionHoverCardProps) {
  const [data, setData] = useState<EvolutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const delayTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Posicionar el popover junto a la tarjeta
  useEffect(() => {
    if (!visible || !anchorEl) return;
    const gap = 8;
    const update = () => {
      const a = anchorEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cRect = containerRef.current?.getBoundingClientRect();
      const cW = cRect?.width ?? 280;
      const cH = cRect?.height ?? 200;

      // Prefer right; flip to left if overflow
      let left = a.right + gap;
      if (left + cW > vw - gap) {
        left = a.left - gap - cW; // left side
      }
      // Clamp horizontally within viewport
      if (left < gap) left = Math.max(gap, vw - cW - gap);

      // Prefer align top to anchor; clamp within viewport vertically
      let top = a.top;
      if (top + cH > vh - gap) top = Math.max(gap, vh - cH - gap);
      if (top < gap) top = gap;

      setPos({ top, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorEl, visible]);

  // Cargar evoluciones cuando sea visible
  useEffect(() => {
    if (!visible || !pokemonId) return;

    const controller = new AbortController();

    // Pequeño delay para evitar flicker por hovers muy rápidos
    delayTimer.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        // 1) species -> obtener URL de evolution_chain
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`, { signal: controller.signal });
        if (speciesRes.status === 404) {
          // not send an error message when not having evolution, only a message
          setNotFound(true);
          return;
        }
        if (!speciesRes.ok) throw new Error(`Species HTTP ${speciesRes.status}`);
        const species = await speciesRes.json();
        const chainUrl: string | undefined = species?.evolution_chain?.url;
        if (!chainUrl) throw new Error("No evolution chain");

        const chainId = extractIdFromUrl(chainUrl);
        if (evoCache.has(chainId)) {
          setData(evoCache.get(chainId)!);
          return;
        }

        // 2) evolution-chain -> obtener árbol
        const chainRes = await fetch(chainUrl, { signal: controller.signal });
        if (!chainRes.ok) throw new Error(`Chain HTTP ${chainRes.status}`);
        const chain = await chainRes.json();

        // 3) Aplanar árbol a una lista de especies
        const items = flattenEvolutionChain(chain?.chain);
        const payload: EvolutionData = { chain: items };
        evoCache.set(chainId, payload);
        setData(payload);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => {
      controller.abort();
      if (delayTimer.current) window.clearTimeout(delayTimer.current);
    };
  }, [visible, pokemonId]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 1050,
        width: 280,
      }}
    >
      <div className="card shadow border-0">
        <div className="card-body">
          <h6 className="card-title mb-2">Evolutions</h6>
          {notFound && <div className="text-muted small">No evolution data available</div>}
          {loading && <div className="text-muted small">Cargando…</div>}
          {error && <div className="text-danger small">Error: {error}</div>}
          {!loading && !error && data && (
            <ul className="list-unstyled m-0">
              {data.chain.map((it) => (
                <li key={it.id} className="d-flex align-items-center gap-2 py-1">
                  <img
                    src={it.image}
                    alt={it.name}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                    loading="lazy"
                  />
                  <span className="badge text-bg-light border">#{it.id}</span>
                  <span className="text-capitalize">{it.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function extractIdFromUrl(url: string) {
  return Number(url.split("/").filter(Boolean).pop());
}

function imageFor(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function flattenEvolutionChain(root: any): EvoItem[] {
  const result: EvoItem[] = [];
  function walk(node: any) {
    if (!node) return;
    const name: string | undefined = node?.species?.name;
    const url: string | undefined = node?.species?.url;
    if (name && url) {
      const id = extractIdFromUrl(url);
      result.push({ id, name, image: imageFor(id) });
    }
    const children: any[] = node?.evolves_to ?? [];
    for (const child of children) walk(child);
  }
  walk(root);
  return result;
}

export default EvolutionHoverCard;