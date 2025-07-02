const path = require('path');

module.exports = {
  webpack(config) {
    // Відфільтрувати системні папки з watch або module.rules, якщо потрібно
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        'C:/Users/radik/Application Data/**',
        'C:/Users/radik/Cookies/**',
      ],
    };
    return config;
  },
};
