import { Link } from "react-router-dom";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchCharacters } from "../services/rickAndMortyService";
import { useState } from "react";

function RMList() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["rm-characters", page],
    queryFn: () => fetchCharacters(page),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const results = data?.results ?? [];
  const pages = data?.info.pages ?? 1;

  return (
    <div className="container my-4">
      <h1 className="h3 mb-2">Rick & Morty Characters</h1>
      <p className="mb-3">
        This list is powered by TanStack Query. It caches pages, keeps previous data while
        paginating, and prefetches character details on hover.
      </p>

      {/* Top controls */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="small">
          Page <strong>{page}</strong> of {pages} {isFetching && <span className="ms-2">(updating…)</span>}
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-secondary"
            disabled={page >= pages || isLoading}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {isLoading && <p>Loading characters…</p>}
      {isError && <p className="text-danger">Error: {(error as Error)?.message}</p>}

      <ul className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3 list-unstyled m-0">
        {results.map((c: any) => (
          <li key={c.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="ratio ratio-1x1 bg-light">
                <img src={c.image} alt={c.name} className="rounded-top object-fit-cover" />
              </div>
              <div className="card-body">
                <h6 className="card-title mb-1 text-truncate" title={c.name}>{c.name}</h6>
                <div className="small text-muted">{c.species} · {c.status}</div>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <Link
                  to={`/rick-morty/${c.id}`}
                  className="btn btn-sm btn-primary"
                  onMouseEnter={() => {
                    // Prefetch detail on hover
                    qc.prefetchQuery({
                      queryKey: ["rm-character", c.id],
                      queryFn: () => fetch(`https://rickandmortyapi.com/api/character/${c.id}`).then(r => r.json()),
                      staleTime: 60_000,
                    });
                  }}
                >
                  View
                </Link>
                <span className="badge text-bg-light">#{c.id}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Bottom controls */}
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="small">Page <strong>{page}</strong> of {pages}</div>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-secondary"
            disabled={page >= pages || isLoading}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default RMList;