// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from './0000_optimal_anita_blake.sql';
import m0001 from './0001_wide_thing.sql';
import m0002 from './0002_fancy_ronan.sql';
import journal from './meta/_journal.json';

  export default {
    journal,
    migrations: {
      m0000,
      m0001,
      m0002
    }
  }
