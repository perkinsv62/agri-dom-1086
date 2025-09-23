import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettings {
  darkMode: boolean;
  locale: string;
  // Add other settings here
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: unknown) => void;
  updateNestedSetting: (section: string, key: string, value: unknown) => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  locale: 'vi-VN',
  // Default values for other settings
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  updateNestedSetting: () => {},
});

export const useAppSettings = () => useContext(AppSettingsContext);

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSetting = (key: string, value: unknown) => {
    // Prevent darkMode from being changed - keep it always false
    if (key === 'darkMode') return;

    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Fix the updateNestedSetting function with proper typing
  const updateNestedSetting = (section: string, key: string, value: unknown) => {
    setSettings((prevSettings) => {
      // Create a copy of the current settings
      const updatedSettings = { ...prevSettings };
      
      // Safely handle the nested section
      const sectionData = updatedSettings[section] as Record<string, unknown>;
      
      // If the section exists, update it
      // Guard: don't allow updating darkMode via nested calls
      if (section === 'darkMode') return prevSettings;

      if (sectionData) {
        // Create a new object for the section to avoid direct mutation
        updatedSettings[section] = {
          ...sectionData,
          [key]: value
        };
      }
      
      return updatedSettings;
    });
  };

  // Always expose darkMode as false regardless of internal state
  const exposedSettings = { ...settings, darkMode: false };

  return (
    <AppSettingsContext.Provider value={{ settings: exposedSettings, updateSetting, updateNestedSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
