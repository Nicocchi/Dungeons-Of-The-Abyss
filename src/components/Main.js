import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputManager from "./InputManager";
import Player from "./Player";
import World from "./World";
import Spawner from "./Spawner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Main = ({ width, height, tilesize }) => {
    const canvasRef = useRef();
    // const [player, setPlayer] = useState(new Player(1, 2, tilesize));
    const [world, setWorld] = useState(new World(width, height, tilesize));
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
        newWorld.createBSPMap();
        // newWorld.moveToSpace(world.player);
        // newWorld.spawn();

        setWorld(newWorld);
    }, []);

    useEffect(() => {
        console.log("Draw to canvas");
        const ctx = canvasRef.current.getContext("2d");
        // canvasRef.current.addEventListener(
        //     "mousemove",
        //     function (evt) {
        //         var mousePos = getMousePos(canvasRef.current, evt);
        //         // setMousePos(mousePos);
        //     },
        //     false
        // );
        ctx.clearRect(0, 0, width * tilesize, height * tilesize);
        world.draw(ctx);
        // player.draw(ctx);
    });

    const handleInput = (action, data) => {
        // console.log(`handle input: ${action}:${JSON.stringify(data)}`);
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        // newWorld.movePlayer(data.x, data.y, ctx);
        setWorld(newWorld);
    };

    const handleItem = (item) => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        // ctx.scale(9, 3)
        newWorld.player.use(item);
        setWorld(newWorld);
    };

    return (
        <div id="GameWrapper" className="Game-Wrapper">
            <div className="container">
                <canvas
                    id="myCanvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 6, backgroundColor: "transparent" }}
                ></canvas>
                <canvas
                    id="src-canvas"
                    ref={canvasRef}
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 12 }}
                ></canvas>
                <canvas
                    id="bg-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{
                        zIndex: 0,
                        backgroundColor: "#201208",
                        display: "none",
                    }}
                ></canvas>

                <canvas
                    id="loot-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 2, display: "none" }}
                ></canvas>
                <canvas
                    id="player-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 2, display: "none" }}
                ></canvas>
                <canvas
                    id="fg-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 7, opacity: "0.6" }}
                ></canvas>
            </div>
            <div className="Game-Sidebar">
                <div className="Stats-Wrapper">
                    <span className="hpbar-span">
                        <p className="hp-text">HP:</p>
                        <span className="hp-span">
                            <p className="hp-num">{world.player.attributes.health}/</p>
                            <p>{world.player.attributes.maxHealth + world.player.attributes.bonusHealth}</p>
                        </span>
                    </span>
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "0.8em",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <p>Gold:</p>
                        <p className="hp-num">{world.player.attributes.gold}</p>
                    </span>
                    <div className="base-stats">
                        <span>
                            <p>Atk:</p>
                            <p>{world.player.attributes.baseAtk + world.player.attributes.atk}</p>
                        </span>
                        <span>
                            <p>Def:</p>
                            <p>{world.player.attributes.baseDef + world.player.attributes.def}</p>
                        </span>
                        <span>
                            <p>L-Hand: </p>
                            <p>{world.player.attributes.leftHand}</p>
                        </span>
                        <span>
                            <p>R-Hand:</p>
                            <p>{world.player.attributes.rightHand}</p>
                        </span>
                    </div>
                </div>
                <div className="Inventory-Wrapper">
                    <h4>Inventory</h4>
                    {world.player.inventory.map((item, index) => (
                        <p className="item" style={{ cursor: "pointer" }} onClick={() => handleItem(item)} key={index}>
                            <FontAwesomeIcon style={{ marginRight: "10px", fontSize: "0.6em" }} icon={faCircle} />
                            {item.attributes.name}
                        </p>
                    ))}
                </div>
                <div className="Log-Wrapper">
                    <ul>
                        {world.history.map((item, index) => (
                            <li key={index}>
                                <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faAngleRight} /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <img id="GFG" src="/images/BrickWall_003.png" />
            <p style={{ position: "absolute", top: 0, left: 0, color: "#FFF" }}>
                X: {mousePos.x}, Y:{mousePos.y}
            </p>
        </div>
    );
};

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}

Main.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    tilesize: PropTypes.number,
};

export default Main;
