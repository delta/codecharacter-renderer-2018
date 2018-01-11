import * as PIXI from 'pixi.js';
import CONSTANTS from './constants';
import Game from './game';
import Proto from './protoparse.js';
import landAsset from "../assets/land.jpg";
import waterAsset from "../assets/water.jpg";

var game;

export function startRenderer(logFile) {
    game = new Game(CONSTANTS.camera);
    PIXI.loader
        .add("land", landAsset)
        .add("water", waterAsset)
        .load(() => {initialize(logFile)});
}

async function initialize() {
    game.stateVariable = await getGameDetails(logFile);
    console.log(game.stateVariable);

    game.buildTerrain();
    game.buildSoldiers(CONSTANTS.soldiers);
    game.buildMap(game.stateVariable.terrainElementSize);

    game.addTerrain();
    game.addSoldiers();
    game.nextFrame();

    game.app.ticker.add(delta => render(delta));
}

function render(delta) {
    game.autoResize();
    game.updateCamera();
    game.updateSoldiers();
    game.nextFrame();

    if (game.frameNo >= game.stateVariable.states.length) {
        console.log("done");
        game.app.ticker.stop();
    }
}

async function getGameDetails(logFile) {
    let proto = new Proto(logFile);
    let gameDetails = await proto.getGame();

    return gameDetails;
}
