import { useState } from "react";
import { createClubs } from "~/services/clubsServices";

type AddClubModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddClubModal({
  onClose,
  onSuccess,
}: AddClubModalProps) {
  const [nameClub, setNameClub] = useState("");
  const [stadium, setStadium] = useState("");
  const [district, setDistrict] = useState("second");
  const [logo, setLogo] = useState<File | null>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // siapkan data untuk dikirim
    const formData = new FormData();
    formData.append("name_club", nameClub);
    formData.append("stadium", stadium);
    formData.append("district", district);

    if (logo) {
      formData.append("logo", logo);
    }
    try {
      // kirim data ke express
      await createClubs(formData);

      // tutup modal
      onClose();

      // ambil ulang databases
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Add Club</h2>

          <button type="button" onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">Club Name</label>

            <input
              type="text"
              value={nameClub}
              onChange={(event) => setNameClub(event.target.value)}
              className="w-full rounded-lg border p-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block">Stadium</label>

            <input
              type="text"
              value={stadium}
              onChange={(event) => setStadium(event.target.value)}
              className="w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block">District</label>

            <input
              type="text"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block">Logo</label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) => setLogo(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Save Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
