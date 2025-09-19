let activities = [];

export const logMintActivity = (playerId, cardMinted) => {
  const entry = {
    timestamp: new Date().toISOString(),
    playerId,
    cardMinted,
    type: 'MINT_ACTIVITY'
  };
  
  activities.unshift(entry);
  if (activities.length > 50) activities = activities.slice(0, 50);
  
  console.log(`MINT: ${playerId} pulled ${cardMinted}`);
};

export const getRecentMintActivities = (limit = 20) => {
  return activities.slice(0, limit);
};
