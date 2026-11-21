import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Compass,
  ExternalLink,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";
import type { MountainSpot, SpotKind } from "../types";

interface SpotExplorerProps {
  spots: MountainSpot[];
  onAddSpot: (spot: Omit<MountainSpot, "id" | "custom">) => void;
  onDeleteSpot: (id: string) => void;
}

function kindLabel(kind: SpotKind) {
  if (kind === "destination") return "Destination";
  if (kind === "underrated") return "Underrated Spot";
  return "Food & Cafe";
}

export function SpotExplorer({
  spots,
  onAddSpot,
  onDeleteSpot,
}: SpotExplorerProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedKind, setSelectedKind] = useState<"all" | SpotKind>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [spotName, setSpotName] = useState("");
  const [spotRegion, setSpotRegion] = useState("Himachal Pradesh");
  const [spotState, setSpotState] = useState("Himachal Pradesh");
  const [spotKind, setSpotKind] = useState<SpotKind>("underrated");
  const [spotSeason, setSpotSeason] = useState("Oct–Nov");
  const [spotNote, setSpotNote] = useState("");

  const regions = useMemo(() => {
    const set = new Set<string>(spots.map((s) => s.region));
    return ["All", ...Array.from(set)];
  }, [spots]);

  const filteredSpots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return spots.filter((spot) => {
      if (selectedRegion !== "All" && spot.region !== selectedRegion) return false;
      if (selectedKind !== "all" && spot.kind !== selectedKind) return false;
      if (!q) return true;
      return (
        spot.name.toLowerCase().includes(q) ||
        spot.region.toLowerCase().includes(q) ||
        spot.state.toLowerCase().includes(q) ||
        spot.note.toLowerCase().includes(q)
      );
    });
  }, [spots, selectedRegion, selectedKind, searchQuery]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanName = spotName.trim();
    const cleanRegion = spotRegion.trim() || "Mountain Belt";
    if (!cleanName) return;

    onAddSpot({
      name: cleanName,
      region: cleanRegion,
      state: spotState.trim() || "India",
      kind: spotKind,
      bestSeason: spotSeason.trim() || "Check local conditions",
      note: spotNote.trim() || "Added by explorer.",
      mapQuery: `${cleanName} ${cleanRegion}`,
    });

    setSpotName("");
    setSpotNote("");
  }

  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <Compass size={18} />
        <h2 style={styles.h2}>Destinations, Underrated Spots & Food</h2>
      </div>

      <div style={styles.filters}>
        <input
          style={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search mountain spots, valleys, states, or food..."
        />
        <select
          style={styles.select}
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "All regions" : r}
            </option>
          ))}
        </select>
        <select
          style={styles.select}
          value={selectedKind}
          onChange={(e) => setSelectedKind(e.target.value as "all" | SpotKind)}
        >
          <option value="all">All types</option>
          <option value="destination">Destinations</option>
          <option value="underrated">Underrated spots</option>
          <option value="food">Food & cafes</option>
        </select>
      </div>

      <div style={styles.grid}>
        {filteredSpots.map((spot) => (
          <article key={spot.id} style={styles.spotCard}>
            <div style={styles.rowBetween}>
              <span style={styles.badge}>
                {spot.kind === "food" ? (
                  <Utensils size={12} />
                ) : spot.kind === "underrated" ? (
                  <Sparkles size={12} />
                ) : (
                  <MapPin size={12} />
                )}
                {kindLabel(spot.kind)}
              </span>
              <span style={styles.mutedText}>{spot.region}</span>
            </div>
            <h3 style={styles.h3}>{spot.name}</h3>
            <p style={styles.p}>{spot.note}</p>
            <div style={styles.spotFooter}>
              <span style={styles.mutedText}>
                {spot.state} · {spot.bestSeason}
              </span>
              <div style={styles.actionRow}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    spot.mapQuery
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkBtn}
                >
                  Maps <ExternalLink size={13} />
                </a>
                {spot.custom && (
                  <button
                    type="button"
                    style={styles.iconDangerBtn}
                    onClick={() => onDeleteSpot(spot.id)}
                    aria-label={`Remove ${spot.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.subCard}>
        <div style={styles.eyebrow}>ADD A SPOT</div>
        <div style={styles.formGrid}>
          <input
            style={styles.input}
            value={spotName}
            onChange={(e) => setSpotName(e.target.value)}
            placeholder="Spot or cafe name *"
            required
          />
          <input
            style={styles.input}
            value={spotRegion}
            onChange={(e) => setSpotRegion(e.target.value)}
            placeholder="Region / Valley (e.g. Spiti, Chopta)"
          />
          <input
            style={styles.input}
            value={spotState}
            onChange={(e) => setSpotState(e.target.value)}
            placeholder="State / UT"
          />
          <select
            style={styles.select}
            value={spotKind}
            onChange={(e) => setSpotKind(e.target.value as SpotKind)}
          >
            <option value="destination">Destination</option>
            <option value="underrated">Underrated spot</option>
            <option value="food">Food & cafe</option>
          </select>
          <input
            style={styles.input}
            value={spotSeason}
            onChange={(e) => setSpotSeason(e.target.value)}
            placeholder="Best months"
          />
          <input
            style={styles.input}
            value={spotNote}
            onChange={(e) => setSpotNote(e.target.value)}
            placeholder="Short tip or note"
          />
        </div>
        <button type="submit" style={styles.primaryBtn}>
          <Plus size={16} /> Add Spot
        </button>
      </form>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h2: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.3,
  },
  h3: {
    margin: "8px 0 6px",
    fontSize: 16,
  },
  p: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "var(--muted)",
    lineHeight: 1.5,
  },
  mutedText: {
    fontSize: 12,
    color: "var(--muted)",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  subCard: {
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "var(--accent)",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  filters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  spotCard: {
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 14,
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 9px",
    borderRadius: 999,
    background: "var(--accent-soft)",
    color: "var(--accent)",
  },
  spotFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingTop: 6,
    borderTop: "1px solid var(--border)",
  },
  actionRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 150,
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 14,
  },
  select: {
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 14,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 10,
    border: "none",
    background: "var(--accent)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  linkBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 600,
    color: "var(--accent)",
    textDecoration: "none",
  },
  iconDangerBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--danger)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
};
