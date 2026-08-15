import { Plus } from "lucide-react";
import { useState } from "react";

  type Player = {
  name: string;
  team: string;
  value: number;
};

type Match = {
  date: string;
  time: string;
  home: string;
  away: string;
  status?: string;
};

const matches: Match[] = [
  {
    date: "Sabtu, 16 Agustus 2026",
    time: "19:00",
    home: "Persib",
    away: "Persija",
    status: "Scheduled",
  },
  {
    date: "Sabtu, 16 Agustus 2026",
    time: "21:00",
    home: "Dewa United",
    away: "Arema FC",
    status: "Scheduled",
  },
  {
    date: "Minggu, 17 Agustus 2026",
    time: "15:30",
    home: "Bali United",
    away: "PSM",
    status: "Scheduled",
  },
  {
    date: "Minggu, 17 Agustus 2026",
    time: "19:00",
    home: "Persebaya",
    away: "Madura United",
    status: "Scheduled",
  },
];

const initialTopScore: Player[] = [
  {
    name: "David da Silva",
    team: "Persib",
    value: 15,
  },
  {
    name: "Alex Martins",
    team: "Dewa United",
    value: 13,
  },
  {
    name: "Gustavo Almeida",
    team: "Persija",
    value: 12,
  },
];

const topAssist: Player[] = [
  {
    name: "Marc Klok",
    team: "Persib",
    value: 8,
  },
  {
    name: "Egy Maulana",
    team: "Dewa United",
    value: 7,
  },
  {
    name: "Witan Sulaeman",
    team: "Persija",
    value: 6,
  },
];
export default function Aside() {
const [topScore, setTopScore] = useState<Player[]>(initialTopScore);
const [showScoreModal, setShowScoreModal] = useState(false);

const [scoreForm, setScoreForm] = useState({
  name: "",
  team: "",
  value: "",
});



  return (
    <aside
      className="
    w-[650px]
    fixed
    top-6
    right-6
    bottom-6
    z-50
    flex
    flex-col
    gap-2
    p-4
    text-white
  "
    >

      {/* JADWAL PERTANDINGAN */}
      <div className="w-full overflow-hidden rounded-lg bg-black/40">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <h2 className="text-lg font-bold">
              Jadwal Pertandingan
            </h2>

            <p className="text-xs text-gray-500">
              Pertandingan mendatang
            </p>
          </div>

          <span className="rounded-md bg-white/10 px-3 py-1 text-xs text-gray-400">
            2026
          </span>
        </div>

        {/* Match List */}
        <div className="flex flex-col">

          {matches.map((match, index) => (

            <div
              key={`${match.date}-${match.time}-${index}`}
              className="
                border-b
                border-white/10
                p-4
                last:border-b-0
                transition
                hover:bg-white/5
              "
            >

              {/* Date */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {match.date}
                </span>

                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-500">
                  {match.status}
                </span>
              </div>

              {/* Match */}
              <div className="flex items-center justify-between">

                {/* Home */}
                <div className="flex w-[35%] items-center justify-end gap-3">
                  <span className="text-right text-sm font-semibold text-gray-300">
                    {match.home}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    H
                  </div>
                </div>

                {/* Time */}
                <div className="flex w-[20%] flex-col items-center">
                  <span className="text-lg font-bold text-white">
                    {match.time}
                  </span>

                  <span className="text-[10px] uppercase text-gray-500">
                    WIB
                  </span>
                </div>

                {/* Away */}
                <div className="flex w-[35%] items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    A
                  </div>

                  <span className="text-sm font-semibold text-gray-300">
                    {match.away}
                  </span>
                </div>

              </div>

            </div>

          ))}

        </div>
      </div>
      <div className="flex gap-2">
        {/* TOP SCORE */}
        <div className="flex-1 rounded-tl-lg bg-black/40 p-4">
          <div className="mb-4 flex justify-between items-center ">
            <h2 className=" text-lg font-bold">Top Score</h2>
            <div>
              {" "}
              <button
                onClick={() => setShowScoreModal(true)}
                className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              bg-white/10
              transition
              hover:bg-white/20
            "
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {topScore.map((player, index) => (
              <div
                key={player.name}
                className="flex items-center justify-between rounded-md bg-white/10 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-bold text-gray-600">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-semibold text-gray-600">{player.name}</p>

                    <p className="text-sm text-gray-500">{player.team}</p>
                  </div>
                </div>

                <span className="font-bold text-gray-600">
                  {player.value} Gol
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOP ASSIST */}
        <div className="flex-1 rounded-tl-lg bg-black/40 p-4">
          <h2 className="mb-4 text-lg font-bold">Top Assist</h2>

          <div className="flex flex-col gap-2">
            {topAssist.map((player, index) => (
              <div
                key={player.name}
                className="flex items-center justify-between rounded-md bg-white/10 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-bold text-gray-600">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-semibold text-gray-600">{player.name}</p>

                    <p className="text-sm text-gray-500">{player.team}</p>
                  </div>
                </div>

                <span className="font-bold text-gray-600">
                  {player.value} Assist
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* MODAL */}
      {showScoreModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="w-[400px] rounded-xl bg-gray-900 p-6 text-white shadow-xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Tambah Top Score</h2>

              <button
                onClick={() => setShowScoreModal(false)}
                className="rounded-md px-3 py-2 hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const newPlayer: Player = {
                  name: scoreForm.name,
                  team: scoreForm.team,
                  value: Number(scoreForm.value),
                };

                setTopScore((prev) => [...prev, newPlayer]);

                // Reset form
                setScoreForm({
                  name: "",
                  team: "",
                  value: "",
                });

                // Tutup modal
                setShowScoreModal(false);
              }}
              className="flex flex-col gap-4"
            >
              {/* Nama */}
              <div>
                <label className="mb-1 block text-sm">Nama Pemain</label>

                <input
                  type="text"
                  value={scoreForm.name}
                  onChange={(e) =>
                    setScoreForm({
                      ...scoreForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-md bg-white/10 p-3 outline-none"
                  placeholder="Nama pemain"
                  required
                />
              </div>

              {/* Tim */}
              <div>
                <label className="mb-1 block text-sm">Tim</label>

                <input
                  type="text"
                  value={scoreForm.team}
                  onChange={(e) =>
                    setScoreForm({
                      ...scoreForm,
                      team: e.target.value,
                    })
                  }
                  className="w-full rounded-md bg-white/10 p-3 outline-none"
                  placeholder="Nama tim"
                  required
                />
              </div>

              {/* Gol */}
              <div>
                <label className="mb-1 block text-sm">Jumlah Gol</label>

                <input
                  type="number"
                  min="0"
                  value={scoreForm.value}
                  onChange={(e) =>
                    setScoreForm({
                      ...scoreForm,
                      value: e.target.value,
                    })
                  }
                  className="w-full rounded-md bg-white/10 p-3 outline-none"
                  placeholder="Jumlah gol"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="rounded-md bg-white p-3 font-bold text-black hover:bg-gray-200"
              >
                Tambahkan
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}