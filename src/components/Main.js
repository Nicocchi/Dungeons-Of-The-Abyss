import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputManager from "./InputManager";
import Player from "./Player";
import World from "./World";
import Spawner from "./Spawner";

const Main = ({ width, height, tilesize }) => {
    const canvasRef = useRef();
    // const [player, setPlayer] = useState(new Player(1, 2, tilesize));
    const [world, setWorld] = useState(new World(width, height, tilesize));
    let inputManager = new InputManager();

    useEffect(() => {
        // console.log("Bind input");
        inputManager.bindKeys();
        inputManager.subscribe(handleInput);

        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(handleInput);
        };
    });

    useEffect(() => {
        console.log("Create Map");
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.createCellularMap();
        newWorld.moveToSpace(world.player);
        let spawner = new Spawner(newWorld);
        spawner.spawnLoot(10);
        spawner.spawnMonsters(6);
        spawner.spawnStairs();
        setWorld(newWorld);
    }, []);

    useEffect(() => {
        console.log("Draw to canvas");
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, width * tilesize, height * tilesize);
        world.draw(ctx);
        // player.draw(ctx);
    });

    const handleInput = (action, data) => {
        // console.log(`handle input: ${action}:${JSON.stringify(data)}`);
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        newWorld.movePlayer(data.x, data.y, ctx);
        setWorld(newWorld);
    };

    const handleItem = (item) => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        newWorld.player.use(item);
        setWorld(newWorld);
    }

    return (
        <div id="GameWrapper" className="Game-Wrapper">
            <canvas
                id="src-canvas"
                ref={canvasRef}
                width={width * tilesize}
                height={height * tilesize}
                className="Game-Canvas"
            ></canvas>
            <canvas
                width={width * tilesize}
                height={height * tilesize}
                className="Game-CanvasBG"
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/FloorTile_001.png)` }}
            ></canvas>
            <canvas
                id="loot-canvas"
                width={width * tilesize}
                height={height * tilesize}
                className="Game-CanvasLoot"
            ></canvas>
            <canvas
                id="player-canvas"
                width={width * tilesize}
                height={height * tilesize}
                className="Game-CanvasPlayer"
            ></canvas>
            <canvas
                id="fg-canvas"
                width={width * tilesize}
                height={height * tilesize}
                className="Game-CanvasFG"
            ></canvas>
            <div className="Inventory-Wrapper">
                <p>Inventory:</p>
                <ul>
                    {world.player.inventory.map((item, index) => (
                        <li style={{cursor: "pointer"}} onClick={() => handleItem(item)}  key={index}>{item.attributes.name}</li>
                    ))}
                </ul>
            </div>

            <div className="Stats-Wrapper">
                    <p>Health: {world.player.attributes.health}</p>
                    <p>Gold: {world.player.attributes.gold}</p>
            </div>
            <div
                className="Log-Wrapper"
                style={{
                    border: "10px solid transparent",
                    padding: "15px",
                    borderImage: `url(${process.env.PUBLIC_URL}/images/CastleWall_001.png)`,
                }}
            >
                <p>Log</p>
                <ul>
                    {world.history.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            {/* <div >
                <img id="wallImg" src="images/BrickWall_001.png" width="16" height="16" />
            </div> */}
        </div>
    );
};

Main.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    tilesize: PropTypes.number,
};

export default Main;
