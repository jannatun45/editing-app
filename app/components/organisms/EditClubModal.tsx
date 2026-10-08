import { useState } from "react";
import type { Club } from "~/types/api/clubs";

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
  const [stadium, setStadium] = useState(club.stadium ?? "");
  const [district, setDistrict] = useState(club.district ?? "");
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("name_club", nameClub);
      formData.append("stadium", stadium);
      formData.append("district", district);

      // Kirim logo hanya jika pengguna memilih logo baru
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

        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">Nama Club</label>
          <input
            value={nameClub}
            onChange={(event) => setNameClub(event.target.value)}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">Stadium</label>
          <input
            value={stadium}
            onChange={(event) => setStadium(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-300">District</label>
          <input
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white outline-none focus:border-blue-500"
          />
        </div>

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
            disabled={saving}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
