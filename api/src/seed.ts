// Seed data for players and coaches from ./data/players.json and ./data/coaches.json
import fs from "fs";
import { fileURLToPath } from "node:url";
import Players from "./models/Players.js";
import Coaches from "./models/Coaches.js";
import connectDB from "./config/db.js";
import { calculateActualAge, calculateLeagueAge } from "./utils/helpers.js";

// delete all existing players and coaches
async function seedData() {
  try {
    await connectDB();
    await Players.deleteMany({});
    await Coaches.deleteMany({});

    const playersDataPath = fileURLToPath(new URL("./data/players.json", import.meta.url));
    const coachesDataPath = fileURLToPath(new URL("./data/coaches.json", import.meta.url));

    const playersData = JSON.parse(fs.readFileSync(playersDataPath, "utf-8"));
    const coachesData = JSON.parse(fs.readFileSync(coachesDataPath, "utf-8"));

    // Calculate actualAge and leagueAge for each player
    const playersWithAges = playersData.map((player: any) => {
      const actualAge = calculateActualAge(player.birthDate);
      const leagueAge = calculateLeagueAge(player.birthDate);
      return { ...player, actualAge, leagueAge };
    });

    await Players.insertMany(playersWithAges);
    await Coaches.insertMany(coachesData);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();