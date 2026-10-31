import { useEffect, useState } from "react";
import type { Club } from "~/types/api/clubs";
import { getAllStadiums, type Stadium } from "~/services/stadiumServices";

type EditClubModalProps = {
  club: Club;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
};

export default function EditClubModal({
  club,
  onClose,
  onSave,
}: EditClubModalProps) {
  const [nameClub, setNameClub] = useState(club.name_club ?? "");

  // Stadium menyimpan ID, bukan nama stadion
  const [stadium, setStadium] = useState(
    typeof club.stadium === "object" && club.stadium !== null
      ? club.stadium._id
      : (club.stadium ?? ""),
  );

  const [district, setDistrict] = useState(club.district ?? "");
  const [logo, setLogo] = useState<File | null>(null);
  const [points, setPoints] = useState(String(club.points ?? 0));

  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Ambil daftar stadion dari backend
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setLoadingStadiums(true);
        const data = await getAllStadiums();
        setStadiums(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil daftar stadion",
        );
      } finally {
        setLoadingStadiums(false);
      }
    };

    fetchStadiums();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("name_club", nameClub);
      formData.append("stadium", stadium);
      formData.append("district", district);
      formData.append("points", points);

      if (logo) {
        formData.append("logo", logo);
      }

      await onSave(formData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal memperbarui club",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit Club</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Nama Club */}
        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">Nama Club</label>
          <input
            value={nameClub}
            onChange={(event) => setNameClub(event.target.value)}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        {/* Pilih Stadium */}
        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">Stadium</label>

          <select
            value={stadium}
            onChange={(event) => setStadium(event.target.value)}
            required
            disabled={loadingStadiums}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
          >
            <option value="">
              {loadingStadiums ? "Memuat stadion..." : "Pilih Stadium"}
            </option>

            {stadiums.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name_stadium} - {item.city}
              </option>
            ))}
          </select>

          {!loadingStadiums && stadiums.length === 0 && (
            <p className="text-xs text-amber-400">
              Belum ada data stadion. Tambahkan stadion terlebih dahulu.
            </p>
          )}
        </div>

        {/* District */}
        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">District</label>
          <input
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        {/* Points */}
        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">Points</label>
          <input
            type="number"
            value={points}
            onChange={(event) => setPoints(event.target.value)}
            required
            step="1"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
          <p className="text-xs text-zinc-500">Masukkan jumlah poin klub.</p>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">
            Logo Club (opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-800"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={saving || loadingStadiums || stadiums.length === 0}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
