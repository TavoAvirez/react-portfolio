import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacter } from "../../services/rickAndMortyService";

function RMDetail() {
  const { id } = useParams();
  const charId = Number(id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rm-character", charId],
    queryFn: () => fetchCharacter(charId),
    enabled: Number.isFinite(charId),
    staleTime: 60_000,
  });

  return (
    <div className="container my-4" style={{ maxWidth: 800 }}>
      <Link to="/rick-morty" className="btn btn-sm btn-outline-secondary mb-3">← Back to list</Link>

      {isLoading && <p>Loading character…</p>}
      {isError && <p className="text-danger">Error: {(error as Error)?.message}</p>}

      {data && (
        <div className="card shadow-sm">
          <div className="row g-0">
            <div className="col-md-4">
              <img src={data.image} alt={data.name} className="img-fluid rounded-start" />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h3 className="card-title">{data.name}</h3>
                <p className="mb-1"><strong>Status:</strong> {data.status}</p>
                <p className="mb-1"><strong>Species:</strong> {data.species}</p>
                <p className="mb-1"><strong>Gender:</strong> {data.gender}</p>
                <p className="mb-1"><strong>Origin:</strong> {data.origin?.name}</p>
                <p className="mb-3"><strong>Location:</strong> {data.location?.name}</p>
                <p className="mb-0 text-muted small">Appears in {data.episode.length} episode(s)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RMDetail;