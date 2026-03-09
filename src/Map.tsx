import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { pontos, type Ponto } from "./pontos";
import { useMemo, useState } from "react";

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const icons = {
  green: createIcon("green"),
  yellow: createIcon("yellow"),
  red: createIcon("red"),
  blue: createIcon("blue"),
};

const HOME_COORDS: L.LatLngExpression = [
  -20.250865557417203, -40.271392873349825,
];

export const MapComponent = () => {
  const [selected, setSelected] = useState<Ponto | null>(null);
  const [search, setSearch] = useState("");

  const mapCenter: L.LatLngExpression = selected
    ? [selected.lat, selected.lng]
    : HOME_COORDS;

  const pontosFiltrados = selected ? [selected] : pontos;

  const sugestoes = useMemo(() => {
    if (!search) return [];
    return pontos
      .filter((p) => p.nome.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 10);
  }, [search]);

  const getIcon = (p: Ponto) => {
    switch (p.distancia) {
      case "10min":
        return icons.green;
      case "30min":
        return icons.yellow;
      case "1h":
        return icons.red;
      default:
        return icons.red;
    }
  };

  const limparBusca = () => {
    setSearch("");
    setSelected(null);
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* BUSCA */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="Buscar escola..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelected(null);
            }}
            style={{
              flex: 1,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              fontSize: 16,
              boxSizing: "border-box",
              background: "white",
            }}
          />

          <button
            onClick={limparBusca}
            style={{
              padding: "10px 14px",
              cursor: "pointer",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "white",
            }}
          >
            ✕
          </button>
        </div>

        {search && sugestoes.length > 0 && (
          <div
            style={{
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 6,
              marginTop: 4,
              maxHeight: 220,
              overflowY: "auto",
              width: "100%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {sugestoes.map((p) => (
              <div
                key={p.nome}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onClick={() => {
                  setSelected(p);
                  setSearch(p.nome);
                }}
              >
                {p.nome}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAPA */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={HOME_COORDS} icon={icons.blue}>
          <Popup>CASA</Popup>
        </Marker>

        {pontosFiltrados.map((p) => (
          <Marker key={p.nome} position={[p.lat, p.lng]} icon={getIcon(p)}>
            <Popup>{p.nome}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
