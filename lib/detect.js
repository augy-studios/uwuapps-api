const BROWSERS = [
  { name: 'Firefox',         value: 'Firefox'  },
  { name: 'Opera',           value: 'OPR'      },
  { name: 'Edge',            value: 'Edg'      },
  { name: 'Chrome',          value: 'Chrome'   },
  { name: 'Safari',          value: 'Safari'   },
  { name: 'Samsung Browser', value: 'SamsungBrowser' },
  { name: 'UC Browser',      value: 'UCBrowser' },
];

const OS_LIST = [
  { name: 'Android',  value: 'Android' },
  { name: 'iOS',      value: 'iPhone'  },
  { name: 'iPadOS',   value: 'iPad'    },
  { name: 'macOS',    value: 'Macintosh' },
  { name: 'Linux',    value: 'Linux'   },
  { name: 'Windows',  value: 'Windows' },
];

/**
 * Parse a User-Agent string into browser and OS info.
 *
 * @param {string} ua - User-Agent string
 * @returns {{ browser: string, os: string, ua: string }}
 */
function parseUserAgent(ua) {
  const browser = BROWSERS.find(b => ua.includes(b.value))?.name || 'Unknown Browser';
  const os      = OS_LIST.find(o => ua.includes(o.value))?.name  || 'Unknown OS';

  return { browser, os, ua };
}

module.exports = { parseUserAgent };
