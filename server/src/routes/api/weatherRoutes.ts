import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  console.log('POST /api/weather');
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data from the API
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    // Save city to search history
    await HistoryService.addCity(cityName);

    return res.json(weatherData);
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await HistoryService.removeCity(id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    return res.json({ message: 'City deleted from history' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;
