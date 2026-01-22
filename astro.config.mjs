// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.psychopedagog.org',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'pl',
        locales: {
          pl: 'pl-PL',
          en: 'en-US',
        },
      },
    }),
    robotsTxt({
      sitemap: 'https://www.psychopedagog.org/sitemap-index.xml',
    }),
  ],
});

