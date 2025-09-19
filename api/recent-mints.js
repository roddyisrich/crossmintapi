import { getRecentMintActivities } from '../lib/activity-logger';

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
      timestamp: activity.timestamp
    }));

    res.status(200).json({
      success: true,
      activities: formattedActivities
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent activities',
      details: error.message
    });
  }
}
