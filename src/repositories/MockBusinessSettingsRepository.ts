import { BusinessSettings } from '../types';
import { BusinessSettingsRepository } from './interfaces';
import { INITIAL_BUSINESS_SETTINGS } from '../data/seedVehicles';

const SETTINGS_STORAGE_KEY = 'leghari_motors_settings_v1';

export class MockBusinessSettingsRepository implements BusinessSettingsRepository {
  async getSettings(): Promise<BusinessSettings> {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_BUSINESS_SETTINGS;
  }

  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }
}

export const businessSettingsRepository = new MockBusinessSettingsRepository();
