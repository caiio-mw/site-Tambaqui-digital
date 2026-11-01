const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:cE1%234A0%21L7%24ai26@db.pfrwhdusjwicebauinnw.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;