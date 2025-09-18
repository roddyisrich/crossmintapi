import { getRecentMintActivities } from '../../lib/logger';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const activities = getRecentMintActivities(20);
    
    const formattedActivities = activities.map(activity => ({
      id: `${activity.timestamp}-${activity.playerId}`,
      userId: activity.playerId,
      cardPulled: activity.cardMinted,
      timestamp: activity.timestamp,
      walletAddress: activity.walletAddress
    }));

    res.status(200).json(formattedActivities);

  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch recent activities' });
  }
}
