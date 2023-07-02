const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const initiliazeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db error : ${e.message}`);git
    process.exit(1);
  }
};
initiliazeDBAndServer();
const snake_case2camel = (item) => {
  return {
    playedId: item.player_id,
    playerName: item.player_name,
    jerseyNumber: item.jersey_number,
    role: item.role,
  };
};
app.get("/players/", async (request, response) => {
  const { player_id } = request.params;
  const Dbquery = `SELECT *
    FROM
    cricket_team
    
    `;

  const playerlist = await db.all(Dbquery);
  response.send(playerlist.map((item)=>{
      snake_case2camel(item)
  )
  });
});
app.get("/players/:playerId",async(request,response)=>{
    let {playerId}=request.params;
    const singlePlayerDetailsQuery=`SELECT *
    FROM
    cricket_team
    WHERE
    player_id=${playerId}`
    const singleplayer= await db.get(singlePlayerDetailsQuery);
    response.send(snake_case2camel(singleplayer));
});
app.post('/players/',async(request,response)=>{
    const {,playerName,jerseyNumber,role}=request.body;
    const new_player_data_Query=`INSERT INTO cricket_team(player_name,jersey_number,role)
    values(${playerName},${jerseyNumber},${role}`)
    const new_player= await db.run(new_player_data_Query);
    response.send("Player Added to Team");
});
app.put(`/players/:playerId/`,async(request,response)=>{
    let {playerName,jerseyNumber,role}=request.body;
    let{playerId}=request.params;
    const update_player_Query=`UPDATE cricket_team
    SET
    
    player_name=${playerName},
    jersey_number=${jerseyNumber},
    role=${role}
    WHERE
    player_id=${playerId}`
    const updated_player= await db.run(update_player_Query);
    response.send("Player Details Updated");
});
app.delete(`/players/:playerId/`,async(request,response)=>{
    let {playerID}=request.params;
    const delete_Query=`DELETE FROM cricket_team
    WHERE
    player_id=${playerId}`
    const deleted_player=await db.run(delete_Query);
    response.send("Player Removed");


});
module.exports=app;


