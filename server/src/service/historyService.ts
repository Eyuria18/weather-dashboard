import fs from 'fs/promises';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'searchHistory.json');

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const id = (Date.now()).toString();
    cities.push(new City(id, name));
    await this.write(cities);
  }

  async removeCity(id: string): Promise<boolean> {
    let cities = await this.read();
    const initialLength = cities.length;
    cities = cities.filter(city => city.id !== id);
    if (cities.length === initialLength) return false;
    await this.write(cities);
    return true;
  }
}

export default new HistoryService();
