import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data from the API
    const weatherData = await WeatherService.getWeatherByCity(city);

    if (!weatherData) {
      return res.status(404).json({ error: 'Weather data not found' });
    }

    // Save city to search history
    await HistoryService.addCityToHistory(city);

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getSearchHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deleted = await HistoryService.deleteCityFromHistory(id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    res.json({ message: 'City deleted from history' });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;
