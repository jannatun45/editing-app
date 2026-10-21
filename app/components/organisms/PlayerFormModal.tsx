import { useEffect, useState, type FormEvent } from "react";
import type { Player } from "~/types/api/player";
import type { Club } from "~/types/api/clubs";

type Props = {
  player?: Player | null;
  clubs: Club[];
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
};

export default function PlayerFormModal({
  player,
  clubs,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [clubId, setClubId] = useState("");
  const [position, setPosition] = useState("MF");
  const [number, setNumber] = useState("");
  const [national, setNational] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [joined, setJoined] = useState("");
  const [contractExpires, setContractExpires] = useState("");
  const [marketValue, setMarketValue] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(player?.name_player ?? "");

    const club = player?.club;
    setClubId(typeof club === "string" ? club : (club?._id ?? ""));

    setPosition(player?.position ?? "MF");
    setNumber(player?.number?.toString() ?? "");
    setNational(player?.national ?? "");
    setDateOfBirth(
      player?.date_of_birth
        ? new Date(player.date_of_birth).toISOString().slice(0, 10)
        : "",
    );
    setJoined(
      player?.joined ? new Date(player.joined).toISOString().slice(0, 10) : "",
    );
    setContractExpires(
      player?.contract_expires
        ? new Date(player.contract_expires).toISOString().slice(0, 10)
        : "",
    );
    setMarketValue(player?.market_value?.toString() ?? "");
  }, [player]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !clubId || !position) {
      setError("Nama, klub, dan posisi wajib diisi.");
      return;
    }

    const formData = new FormData();

    formData.append("name_player", name.trim());
    formData.append("club", clubId);
    formData.append("position", position);
    formData.append("number", number);
    formData.append("national", national);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("joined", joined);
    formData.append("contract_expires", contractExpires);
    formData.append("market_value", marketValue);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      setSaving(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pemain.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/60";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="my-auto w-full max-w-2xl space-y-5 rounded-2xl border border-white/10 bg-[#15161b] p-5 sm:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {player ? "Edit Player" : "Add Player"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Lengkapi informasi pemain di bawah ini.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-zinc-400 hover:bg-white/5"
          >
            ×
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-300"
          >
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span>Nama pemain *</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nama lengkap"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>Klub *</span>
            <select
              required
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className={inputClass}
            >
              <option value="">Pilih klub</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name_club}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Posisi *</span>
            <select
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={inputClass}
            >
              <option value="GK">Goalkeeper</option>
              <option value="DF">Defender</option>
              <option value="MF">Midfielder</option>
              <option value="FW">Forward</option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Nomor punggung</span>
            <input
              type="number"
              min="0"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className={inputClass}
              placeholder="10"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>Kewarganegaraan</span>
            <input
              value={national}
              onChange={(e) => setNational(e.target.value)}
              className={inputClass}
              placeholder="Indonesia"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>Tanggal lahir</span>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>Tanggal bergabung</span>
            <input
              type="date"
              value={joined}
              onChange={(e) => setJoined(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="space-y-2 text-sm">
            <span>Kontrak berakhir</span>
            <input
              type="date"
              value={contractExpires}
              onChange={(e) => setContractExpires(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="space-y-2 text-sm sm:col-span-2">
            <span>Market value</span>
            <input
              type="number"
              min="0"
              value={marketValue}
              onChange={(e) => setMarketValue(e.target.value)}
              className={inputClass}
              placeholder="Nilai pasar"
            />
          </label>

          <label className="space-y-2 text-sm sm:col-span-2">
            <span>Foto pemain</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className={inputClass}
            />
            <span className="block text-xs text-zinc-500">
              Maksimal 5 MB. Kosongkan jika ingin mempertahankan foto lama.
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-300 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan pemain"}
          </button>
        </div>
      </form>
    </div>
  );
}
