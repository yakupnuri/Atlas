module.exports = {
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'tr', 'en'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
