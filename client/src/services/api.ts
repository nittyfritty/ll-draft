import type { Player, Coach } from "../types";

export const fetchPlayersByCoachId = async (coachId: string): Promise<Player[]> => {
  const response = await fetch(`/api/players?coachId=${coachId}`);

  if (!response.ok) {
    throw new Error(`Error fetching players for coach ${coachId}: ${response.statusText}`);
  }

  return response.json();
};

// FetchPlayers fetches all players from the API, optionally filtered
export const fetchPlayers = async (filters?: {
  name?: string;
  division?: string;
}): Promise<Player[]> => {
  const params = new URLSearchParams();

  if (filters?.name) {
    params.set("name", filters.name);
  }

  if (filters?.division && filters.division !== "All") {
    params.set("division", filters.division);
  }

  const queryString = params.toString();
  const url = queryString ? `/api/players?${queryString}` : "/api/players";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching players: ${response.statusText}`);
  }

  return response.json();
};

export const updatePlayerCoach = async (
  playerId: string,
  coachId: string | null,
): Promise<Player> => {
  const response = await fetch(`/api/players/${playerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coachId }),
  });

  if (!response.ok) {
    throw new Error(`Error updating player assignment: ${response.statusText}`);
  }

  return response.json();
};

// FetchCoaches fetches all coaches from the API
export const fetchCoaches = async (): Promise<Coach[]> => {
  const response = await fetch("/api/coaches");

  if (!response.ok) {
    throw new Error(`Error fetching coaches: ${response.statusText}`);
  }

  return response.json();
};