# WIP blast csgo

# Setup
- There are three services namely,
    - Log Streaming Service
    - API Service
    - Web Service
- To get started
    * Move the env from ```/game-stats/docker/config/.env to .``` [same context of compose file]
    *  Move the debug config from ```/game-stats/docker/config/.vscode to . ```
    * `docker-compose up -d` this would give the logs for the game stats
    * `docker-compose up service-csgo` to follow logs and get the analysis
    * `http://localhost:4200` default angular project expose