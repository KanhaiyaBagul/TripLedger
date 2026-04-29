import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tripledger.app',
  appName: 'TripLedger',
  webDir: 'public',
  server: {
    url: 'https://strong-times-ask.loca.lt',
    cleartext: true
  }
};

export default config;
