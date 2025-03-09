import dotenv from 'dotenv';

dotenv.config();

// Interface for Coordinates
interface Coordinates {
  lat: number;
  lon: number;
}

// Weather class to structure weather data
class Weather {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;

  constructor(data: any) {
    this.temperature = data.main.temp;
    this.description = data.weather[0].description;
    this.icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
  }
}

class WeatherService {
  private baseURL = 'https://api.openweathermap.org';
  private apiKey = process.env.API_KEY || '';

  // Fetch location data using city name
  private async fetchLocationData(city: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
    console.log(url);
    const response = await fetch(url);
    return response.json();
  }

  // Extract latitude and longitude from API response
  private destructureLocationData(locationData: any[]): Coordinates | null {
    if (!locationData.length) return null;
    return { lat: locationData[0].lat, lon: locationData[0].lon };
  }

  // Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;

    const response = await fetch(url);
    return response.json();
  }

  // Get weather for a given city
  async getWeatherForCity(city: string): Promise<Weather[] | null> {
    try {
      const locationData = await this.fetchLocationData(city);
      const coordinates = this.destructureLocationData(locationData);

      if (!coordinates) {
        throw new Error('Location not found');
      }

      const weatherData = await this.fetchWeatherData(coordinates);
      return [new Weather(weatherData)];
    } catch (error: any) {
      console.error('Error fetching weather data:', error.message);
      return null;
    }
  }
}

export default new WeatherService();
