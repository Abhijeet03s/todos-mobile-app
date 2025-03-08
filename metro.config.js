const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('png');

// Combine the configurations properly
const nativeWindConfig = withNativeWind(config, { input: './global.css' });

nativeWindConfig.reporter = {
   update: () => { },
};

module.exports = nativeWindConfig;
