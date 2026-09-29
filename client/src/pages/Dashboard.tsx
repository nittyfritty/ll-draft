import { useEffect, useState } from "react";
import type { Coach, Player } from "../types";
import { getErrorMessage } from "../services/errorMsg";
import { fetchCoaches, fetchPlayers } from "../services/api";
import { averageEvaluationScore } from "../utils/avgEvaluationScore";

const Dashboard = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachesData = await fetchCoaches();
        setCoaches(coachesData);
        const playersData = await fetchPlayers();
        setPlayers(playersData);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Coaches</h2>
      <ul>
        {coaches.map((coach) => (
          <li key={coach._id}>
            {coach.name} - Players: {coach.playerCount}
          </li>
        ))}
      </ul>
      <section>
      <h2>Players</h2>
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
              </tr>
            );
          })}
        </tbody>
      </table>
      </section>
    </div>
  );
};

export default Dashboard;