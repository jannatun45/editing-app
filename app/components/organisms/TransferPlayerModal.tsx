import { useState } from "react";
import type { Player } from "~/types/api/player";
import type { Club } from "~/types/api/clubs";

type Props = {
  player: Player;
  clubs: Club[];
  onClose: () => void;
  onTransfer: (clubId: string) => Promise<void>;
};

export default function TransferPlayerModal({
  player,
  clubs,
  onClose,
  onTransfer,
}: Props) {
  const currentClubId =
    typeof player.club === "string" ? player.club : (player.club?._id ?? "");

  const currentClubName =
    typeof player.club === "string"
      ? "Klub saat ini"
      : (player.club?.name_club ?? "Klub saat ini");

  const [destination, setDestination] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!destination) {
      setError("Pilih klub tujuan.");
      return;
    }

    if (destination === currentClubId) {
      setError("Pilih klub yang berbeda dari klub saat ini.");
      return;
    }

    if (
      !window.confirm(
        `Transfer ${player.name_player} dari ${currentClubName} ke ${
          clubs.find((club) => club._id === destination)?.name_club
        }?`,
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onTransfer(destination);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer gagal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-[#15161b] p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Player Transfer
          </p>
          <h2 className="mt-2 text-xl font-bold">
            Transfer {player.name_player}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Tentukan klub baru untuk pemain ini.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs text-zinc-500">Klub asal</p>
          <p className="mt-1 font-semibold">{currentClubName}</p>
          <div className="my-3 text-amber-400">↓</div>
          <p className="text-xs text-zinc-500">Klub tujuan</p>

          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] p-3 text-sm text-white outline-none focus:border-amber-400/60"
          >
            <option value="">Pilih klub tujuan</option>
            {clubs
              .filter((club) => club._id !== currentClubId)
              .map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name_club}
                </option>
              ))}
          </select>
        </div>

        {error && (
          <p role="alert" className="text-sm text-rose-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm"
          >
            Batal
          </button>
          <button
            disabled={saving || !destination}
            onClick={submit}
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {saving ? "Memproses..." : "Konfirmasi transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}
