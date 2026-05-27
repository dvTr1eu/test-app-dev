import type { DiscountFormValues } from '../types/discountForm';

export type SaveVolumeDiscountResponse = {
  id: string;
  success: boolean;
  weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
};

export async function saveVolumeDiscount(
  data: DiscountFormValues,
): Promise<SaveVolumeDiscountResponse> {
  const weatherResponse = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=10.8231&longitude=106.6297&current_weather=true',
  );

  if (!weatherResponse.ok) {
    throw new Error('Cannot fetch weather data');
  }

  const weatherData = (await weatherResponse.json()) as {
    current_weather?: {
      temperature: number;
      windspeed: number;
      weathercode: number;
      time: string;
    };
  };
  const currentWeather = weatherData.current_weather;

  console.info('[weather API] current weather', currentWeather);
  console.info('[submit] saveVolumeDiscount payload', data);

  return {
    id: `vd-${Date.now()}`,
    success: true,
    weather: currentWeather,
  };
}
