// FetchPlayersByCoachId fetches players associated with a specific coach ID

import type { Player, Coach } from "../types";


export const fetchPlayersByCoachId = async (coachId: string): Promise<Player[]> => {
  const response = await fetch(`/api/players?coachId=${coachId}`);
  if (!response.ok) {
    throw new Error(`Error fetching players for coach ${coachId}: ${response.statusText}`);
  }
  return response.json();
};

// FetchPlayers fetches all players from the API
export const fetchPlayers = async (): Promise<Player[]> => {
  const response = await fetch("/api/players");
  if (!response.ok) {
    throw new Error(`Error fetching players: ${response.statusText}`);
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