const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png');

// Combine the configurations properly
const nativeWindConfig = withNativeWind(config, { input: './global.css' });

// Add a custom logger to filter out specific warnings
nativeWindConfig.reporter = {
   update: (event) => {
      // Filter out specific warnings
      if (
         event.type === 'update' &&
         event.log &&
         (event.log.includes('JavaScript logs will be removed from Metro') ||
            event.log.includes('expo-notifications') ||
            event.log.includes('NOBRIDGE'))
      ) {
         return;
      }

      // Use the default reporter for everything else
      require('metro/src/lib/reporting').update(event);
   }
};

module.exports = nativeWindConfig;
