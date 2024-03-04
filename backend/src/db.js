const Pool = require("pg").Pool

const pool = new Pool({
    user: "nik",
    password: "ye5UXUCSxEpAIaUf3ZVoR6ZLPnMnsWnO",
    host: "dpg-cnalbvev3ddc73daidng-a.ohio-postgres.render.com",
    port: 5432,
    database: "food_database_yt84",
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;