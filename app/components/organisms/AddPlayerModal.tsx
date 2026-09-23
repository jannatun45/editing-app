import { useState, type FormEvent } from "react";
type AddPlayerModalProps = {
  clubId: string;
  onClose: () => void;
  onSuccess: () => void;
};
export default function AddPlayerModal({
  clubId,
  onClose,
  onSuccess,
}: AddPlayerModalProps) {
  const [namePlayer, setNamePlayer] = useState("");
  const [number, setNumber] = useState("");
  const [position, setPosition] = useState<"GK" | "DF" | "MF" | "FW">("MF");
  const [photo, setPhoto] = useState<File | null>(null);
  const [national, setNational] = useState("");
  const [marketValue, setMarketValue] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [joined, setJoined] = useState("");
  const [contractExpires, setContractExpires] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("club", clubId);
      formData.append("name_player", namePlayer);
      formData.append("number", number);
      formData.append("position", position);
      if (photo) {
        formData.append("photo", photo);
      }
      if (national) {
        formData.append("national", national);
      }
      if (marketValue) {
        formData.append("market_value", marketValue);
      }
      if (dateOfBirth) {
        formData.append("date_of_birth", dateOfBirth);
      }
      if (joined) {
        formData.append("joined", joined);
      }
      if (contractExpires) {
        formData.append("contract_expires", contractExpires);
      }
      const response = await fetch("http://localhost:3000/api/players", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan player");
      }
      onSuccess();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal menambahkan player",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      {" "}
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-zinc-900 p-6">
        {" "}
        {/* Header */}{" "}
        <div className="mb-6 flex items-center justify-between">
          {" "}
          <h2 className="text-xl font-bold text-white"> Add Player </h2>{" "}
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-zinc-400 hover:text-white"
          >
            {" "}
            ✕{" "}
          </button>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-5">
          {" "}
          {/* Player Name */}{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm text-zinc-400">
              {" "}
              Player Name{" "}
            </label>{" "}
            <input
              type="text"
              value={namePlayer}
              onChange={(event) => setNamePlayer(event.target.value)}
              placeholder="Nama player"
              required
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
            />{" "}
          </div>{" "}
          {/* Player Photo */}{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm text-zinc-400">
              {" "}
              Player Photo{" "}
            </label>{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                setPhoto(event.target.files?.[0] ?? null);
              }}
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white"
            />{" "}
            {photo && (
              <p className="mt-2 text-sm text-zinc-500">
                {" "}
                Selected: {photo.name}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* Number + Position */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            {/* Number */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-sm text-zinc-400">
                {" "}
                Jersey Number{" "}
              </label>{" "}
              <input
                type="number"
                min="1"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="10"
                required
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
              />{" "}
            </div>{" "}
            {/* Position */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-sm text-zinc-400">
                {" "}
                Position{" "}
              </label>{" "}
              <select
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value as "GK" | "DF" | "MF" | "FW")
                }
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
              >
                {" "}
                <option value="GK"> Goalkeeper </option>{" "}
                <option value="DF"> Defender </option>{" "}
                <option value="MF"> Midfielder </option>{" "}
                <option value="FW"> Forward </option>{" "}
              </select>{" "}
            </div>{" "}
          </div>{" "}
          {/* Nationality */}{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm text-zinc-400">
              {" "}
              Nationality{" "}
            </label>{" "}
            <input
              type="text"
              value={national}
              onChange={(event) => setNational(event.target.value)}
              placeholder="Indonesia"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
            />{" "}
          </div>{" "}
          {/* Date of Birth */}{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm text-zinc-400">
              {" "}
              Date of Birth{" "}
            </label>{" "}
            <input
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
            />{" "}
          </div>{" "}
          {/* Joined + Contract */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            {/* Joined */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-sm text-zinc-400">
                {" "}
                Joined{" "}
              </label>{" "}
              <input
                type="date"
                value={joined}
                onChange={(event) => setJoined(event.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
              />{" "}
            </div>{" "}
            {/* Contract Expires */}{" "}
            <div>
              {" "}
              <label className="mb-2 block text-sm text-zinc-400">
                {" "}
                Contract Expires{" "}
              </label>{" "}
              <input
                type="date"
                value={contractExpires}
                onChange={(event) => setContractExpires(event.target.value)}
                className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Market Value */}{" "}
          <div>
            {" "}
            <label className="mb-2 block text-sm text-zinc-400">
              {" "}
              Market Value{" "}
            </label>{" "}
            <input
              type="number"
              min="0"
              value={marketValue}
              onChange={(event) => setMarketValue(event.target.value)}
              placeholder="2500000"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
            />{" "}
          </div>{" "}
          {/* Error */}{" "}
          {error && <p className="text-sm text-red-400"> {error} </p>}{" "}
          {/* Buttons */}{" "}
          <div className="flex justify-end gap-3 pt-2">
            {" "}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-zinc-800 px-5 py-2.5 text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {" "}
              Cancel{" "}
            </button>{" "}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-white px-5 py-2.5 font-medium text-black disabled:opacity-50"
            >
              {" "}
              {loading ? "Saving..." : "Add Player"}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
}
