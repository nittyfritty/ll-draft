function calculateActualAge(birthdate: string | Date): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
        age--;
    }
    return age;
}

function calculateLeagueAge(birthdate: string | Date): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    // Little League age is the player's age as of August 31st of the current year.
    const august31st = new Date(Date.UTC(today.getUTCFullYear(), 7, 31));
    let age = august31st.getUTCFullYear() - birthDate.getUTCFullYear();
    const monthDiff = august31st.getUTCMonth() - birthDate.getUTCMonth();
    if (monthDiff < 0 || (monthDiff === 0 && august31st.getUTCDate() < birthDate.getUTCDate())) {
        age--;
    }
    return age;
}

function populatePlayerAges(body: Record<string, unknown>): void {
    const birthDate = body.birthDate;
    if (!(birthDate instanceof Date) && typeof birthDate !== "string") {
        delete body.actualAge;
        delete body.leagueAge;
        return;
    }

    body.actualAge = calculateActualAge(birthDate);
    body.leagueAge = calculateLeagueAge(birthDate);
}

export { calculateActualAge, calculateLeagueAge, populatePlayerAges };
