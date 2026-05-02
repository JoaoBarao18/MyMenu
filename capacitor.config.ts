import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mymenu.app',
  appName: 'MyMenu',
  webDir: 'dist',
  plugins: {
    ScreenOrientation: {
      orientation: 'portrait',
    },
  },
};

export default config;
