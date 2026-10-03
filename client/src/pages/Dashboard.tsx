import { useEffect, useState } from "react";
import type { Coach, Player } from "../types";
import { getErrorMessage } from "../services/errorMsg";
import { fetchCoaches, fetchPlayers, updatePlayerCoach } from "../services/api";
import { averageEvaluationScore } from "../utils/avgEvaluationScore";

const divisions = ["T-Ball U4", "T-Ball U6", "A", "AA","AAA","Majors"];
const divisionFilterOptions = ["All", ...divisions];

const Dashboard = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingPlayerId, setUpdatingPlayerId] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] =
    useState<(typeof divisionFilterOptions)[number]>("All");

  const selectedCoach =
    coaches.find((coach) => coach._id === selectedCoachId) ?? coaches[0] ?? null;
  const teamPlayers = selectedCoach
    ? players.filter((player) => player.coachId === selectedCoach._id)
    : players;

  const handleCoachChange = async (player: Player, coachId: string | null) => {
    setError(null);
    setUpdatingPlayerId(player._id);

    try {
      const updatedPlayer = await updatePlayerCoach(player._id, coachId);
      setPlayers((currentPlayers) =>
        currentPlayers.map((currentPlayer) =>
          currentPlayer._id === updatedPlayer._id
            ? { ...currentPlayer, coachId: updatedPlayer.coachId }
            : currentPlayer
        )
      );

      if (player.coachId !== updatedPlayer.coachId) {
        setCoaches((currentCoaches) =>
          currentCoaches.map((coach) => {
            const countChange =
              (coach._id === updatedPlayer.coachId ? 1 : 0) -
              (coach._id === player.coachId ? 1 : 0);
            return countChange === 0
              ? coach
              : { ...coach, playerCount: coach.playerCount + countChange };
          })
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : getErrorMessage(err));
    } finally {
      setUpdatingPlayerId(null);
    }
  };

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        const [coachesData, playersData] = await Promise.all([
          fetchCoaches({
            name: searchQuery.trim() || undefined,
            division: divisionFilter === "All" ? undefined : divisionFilter,
          }),
          fetchPlayers({
            name: searchQuery.trim() || undefined,
            division: divisionFilter === "All" ? undefined : divisionFilter,
          }),
        ]);

        if (!isActive) return;

        setCoaches(coachesData);
        setPlayers(playersData);
      } catch (err) {
        if (isActive) setError(getErrorMessage(err));
      }
    };

    void fetchData();

    return () => {
      isActive = false;
    };
  }, [searchQuery, divisionFilter]);

  useEffect(() => {
    if (!coaches.length) {
      setSelectedCoachId("");
      return;
    }

    if (!selectedCoachId || !coaches.some((coach) => coach._id === selectedCoachId)) {
      setSelectedCoachId(coaches[0]._id);
    }
  }, [coaches, selectedCoachId]);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Coaches</h2>
            <select
              value={divisionFilter}
              onChange={(event) => setDivisionFilter(event.target.value as (typeof divisionFilterOptions)[number])}
              aria-label="Filter coaches by division"
            >
              {divisionFilterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
      <ul>
        {coaches.map((coach) => (
          <li key={coach._id}>
            {coach.name} - Players: {coach.playerCount}
          </li>
        ))}
      </ul>
      <section>
      <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 0" }}>
          <h2>Players</h2>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name"
              aria-label="Search players by name"
              style={{ minWidth: "220px" }}
            />
          </div>
          <table className="player-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actual Age</th>
                <th>League Age</th>
                <th>Batting</th>
                <th>Fielding</th>
                <th>Throwing</th>
                <th>Overall</th>
                <th>Coach</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const overallScore = player.evaluationScore
                  ? averageEvaluationScore(player.evaluationScore)
                  : NaN;

                return (
                  <tr key={player._id}>
                    <td>{player.name}</td>
                    <td>{player.actualAge}</td>
                    <td>{player.leagueAge}</td>
                    <td>{player.evaluationScore?.find(([skill]) => skill === "Batting")?.[1] ?? "N/A"}</td>
                    <td>{player.evaluationScore?.find(([skill]) => skill === "Fielding")?.[1] ?? "N/A"}</td>
                    <td>{player.evaluationScore?.find(([skill]) => skill === "Throwing")?.[1] ?? "N/A"}</td>
                    <td>{Number.isNaN(overallScore) ? "N/A" : overallScore}</td>
                    <td>
                      <select
                        aria-label={`Coach for ${player.name}`}
                        value={player.coachId ?? ""}
                        disabled={updatingPlayerId !== null}
                        onChange={(event) => {
                          void handleCoachChange(player, event.target.value || null);
                        }}
                      >
                        <option value="">Unassigned</option>
                        {coaches.map((coach) => (
                          <option key={coach._id} value={coach._id}>
                            {coach.nameDisplay ?? coach.name} (Players: {coach.playerCount})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ flex: "0 0 260px" }}>
          <h2>Team</h2>
          <label htmlFor="selected-coach">Choose coach</label>
          <select
            id="selected-coach"
            value={selectedCoachId}
            onChange={(event) => setSelectedCoachId(event.target.value)}
            style={{ display: "block", margin: "8px 0 16px", width: "100%" }}
          >
            {coaches.map((coach) => (
              <option key={coach._id} value={coach._id}>
                {coach.nameDisplay ?? coach.name}
              </option>
            ))}
          </select>

          {selectedCoach ? (
            <>
              <strong>{selectedCoach.nameDisplay ?? selectedCoach.name}</strong>
              <ul>
                {teamPlayers.length ? (
                  teamPlayers.map((player) => (
                    <li key={player._id}>
                      {player.name}{" "}
                      <button
                        type="button"
                        aria-label={`Remove ${player.name} from ${selectedCoach.nameDisplay ?? selectedCoach.name}`}
                        title="Return player to pool"
                        disabled={updatingPlayerId !== null}
                        onClick={() => void handleCoachChange(player, null)}
                      >
                        X
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No players assigned</li>
                )}
              </ul>
            </>
          ) : (
            <p>No coach selected</p>
          )}
        </div>
      </div>
      </section>
    </div>
  );
};

export default Dashboard;