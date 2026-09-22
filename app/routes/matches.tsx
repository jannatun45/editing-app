import { useEffect, useState } from "react";
import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import Container from "~/components/templates/Container";

import {
  getMatches,
  generateMatches,
  updateMatchScore,
} from "~/services/matchesServices";
import type { Fixture } from "~/types/api/fixtures";

import type { Match } from "~/types/api/matches";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [season, setSeason] = useState("2026/2027");

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("oke");
  // Ambil jadwal
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches(season);

      setMatches(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [season]);

  // Generate jadwal
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      await generateMatches(season);

      await loadMatches();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal membuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  // save update match
  const handleSaveScore = async (homeScore: number, awayScore: number) => {
    if (!selectedMatch) return;
    console.log("testing");
    try {
      setLoading(true);
      setError("");
      console.log("selec id -> ", selectedMatch._id);
      console.log("home -> ", homeScore);
      console.log("away -> ", awayScore);
      await updateMatchScore(selectedMatch._id, homeScore, awayScore);

      // Ambil ulang data dari database
      await loadMatches();

      // Tutup modal
      setSelectedMatch(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal mengupdate score",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Matches</h1>

            <p className="text-zinc-500">Jadwal pertandingan liga</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2 text-black"
          >
            Generate Schedule
          </button>
        </div>

        {/* Season */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Season</label>

          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
          >
            <option value="2026/2027">2026/2027</option>

            <option value="2027/2028">2027/2028</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <p className="text-zinc-400">Loading...</p>}

        {/* Matches */}
        {!loading && matches.length === 0 && (
          <p className="text-zinc-500">Belum ada pertandingan.</p>
        )}

        {/* 
  Container untuk seluruh daftar pertandingan.
  space-y-8 = memberi jarak vertikal antar Matchday.
*/}
        <div className="space-y-8">
          {/*
    matches = semua data pertandingan.

    reduce() digunakan untuk mengelompokkan pertandingan
    berdasarkan matchday.

    Contoh data:
    [
      { matchday: 1, ... },
      { matchday: 1, ... },
      { matchday: 2, ... },
      { matchday: 2, ... }
    ]

    Akan diubah menjadi:
    {
      1: [pertandingan, pertandingan],
      2: [pertandingan, pertandingan]
    }
  */}
          {Object.entries(
            matches.reduce(
              (groups, match) => {
                /*
          Mengecek apakah group untuk matchday ini
          sudah dibuat atau belum.

          Contoh:
          groups[1] belum ada
        */
                if (!groups[match.matchday]) {
                  /*
            Kalau belum ada, buat array kosong.

            Contoh:
            groups[1] = []
          */
                  groups[match.matchday] = [];
                }

                /*
          Masukkan pertandingan ke dalam group
          sesuai matchday-nya.

          Contoh:
          groups[1].push(match)

          Artinya pertandingan ini masuk
          ke Matchday 1.
        */
                groups[match.matchday].push(match);

                /*
          Kembalikan groups yang sudah diperbarui
          untuk proses pertandingan berikutnya.
        */
                return groups;
              },

              /*
        Nilai awal reduce adalah object kosong.

        Record<number, Match[]>
        artinya:
        key   = number (matchday)
        value = array berisi Match
      */
              {} as Record<number, Match[]>,
            ),
          )

            /*
    Object.entries() mengubah object:

    {
      1: [match1, match2],
      2: [match3, match4]
    }

    menjadi array:

    [
      ["1", [match1, match2]],
      ["2", [match3, match4]]
    ]

    Kemudian setiap group di-loop menggunakan map().
  */
            .map(([matchday, dayMatches]) => (
              /*
      Container untuk satu Matchday.

      key={matchday} digunakan React
      sebagai identitas unik element.
    */
              <div key={matchday} className="space-y-3">
                {/*
        Menampilkan judul Matchday.

        Contoh:
        Matchday 1
        Matchday 2
        Matchday 3
      */}
                <h2 className="text-lg font-semibold text-white">
                  Matchday {matchday}
                </h2>

                {/*
        dayMatches berisi semua pertandingan
        yang berada di Matchday tersebut.

        Contoh:
        dayMatches = [
          match1,
          match2,
          match3
        ]
      */}
                {dayMatches.map((match) => (
                  /*
          Menampilkan satu MatchCard
          untuk setiap pertandingan.
        */
                  <MatchCard
                    /*
            key digunakan React untuk membedakan
            setiap MatchCard.

            _id berasal dari MongoDB.
          */
                    key={match._id}

                    /*
            Mengirim data pertandingan ke MatchCard.

            Di dalam MatchCard nanti bisa menggunakan:
            match.home_club
            match.away_club
            match.home_score
            match.away_score
            dll.
          */
                    match={match}

                    /*
            Ketika MatchCard diklik,
            jalankan:

            setSelectedMatch(match)

            Artinya pertandingan yang diklik
            disimpan ke state selectedMatch.

            Setelah itu EditScoreModal akan muncul.
          */
                    onClick={() => setSelectedMatch(match)}
                  />
                ))}
              </div>
            ))}
        </div>

        {/*
  Mengecek apakah ada pertandingan yang sedang dipilih.

  Kalau:
    selectedMatch = null
    → modal tidak ditampilkan.

  Kalau:
    selectedMatch = object pertandingan
    → modal ditampilkan.
*/}
        {selectedMatch && (
          /*
    Menampilkan modal edit score.

    match={selectedMatch}
    mengirim pertandingan yang sedang dipilih
    ke dalam EditScoreModal.
  */
          <EditScoreModal
            match={selectedMatch}

            /*
      Ketika modal meminta ditutup,
      selectedMatch dikembalikan menjadi null.

      Akibatnya:

      {selectedMatch && (...)}

      menjadi false sehingga modal hilang.
    */
            onClose={() => setSelectedMatch(null)}

            /*
      Mengirim fungsi handleSaveScore
      dari component Matches ke modal.

      Jadi ketika tombol Save di modal diklik,
      EditScoreModal akan menjalankan:

      onSave(homeScore, awayScore)

      kemudian fungsi handleSaveScore()
      di component Matches akan bekerja.
    */
            onSave={handleSaveScore}
          />
        )}
      </div>
    </Container>
  );
}
