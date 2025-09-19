let activities = [];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      activities: activities.slice(0, 20)
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
