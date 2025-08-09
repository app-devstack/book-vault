import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes } from './themes';


export const config = createTamagui({
  ...defaultConfig,
	themes,
	shorthands,
  media: {

    ...defaultConfig.media,
    // add your own media queries here, if wanted
  },
});

type OurConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends OurConfig {}
}
