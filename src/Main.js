import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import InputManager from "./classes/InputManager";
import World from "./classes/Engine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const Main = ({ width, height, tilesize }) => {
    const canvasRef = useRef();
    const [world, setWorld] = useState(new World(width, height, tilesize));
    let inputManager = new InputManager();

    useEffect(() => {
        inputManager.bindKeys();
        inputManager.subscribe(handleInput);

        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(handleInput);
        };
    });

    useEffect(() => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.init();
        setWorld(newWorld);
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, width * tilesize, height * tilesize);
        world.draw(ctx);
    });

    const handleInput = (action, data) => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        switch (action) {
            case "move":
                newWorld.movePlayer(data.x, data.y, ctx);
                setWorld(newWorld);
                break;
            case "changeDungeons":
                newWorld.changeDungeons();
                setWorld(newWorld);
                break;
            default:
                break;
        }
    };

    const handleItem = (item) => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        const ctx = canvasRef.current.getContext("2d");
        newWorld.player.use(item);
        setWorld(newWorld);
    };

    return (
        <div id="GameWrapper" className="Game-Wrapper">
            <div className="container">
                <div className="modal" style={{ display: world.loading ? "flex" : "none" }}>
                    <div className="modal-content">
                        <h1>Building the abyss</h1>
                    </div>
                </div>
                <canvas
                    id="bg-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{
                        zIndex: 0,
                        // backgroundColor: "#201208",
                    }}
                ></canvas>
                <canvas
                    id="wall-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 1 }}
                ></canvas>
                <canvas
                    id="player-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 3 }}
                ></canvas>
                <canvas
                    id="loot-canvas"
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 2 }}
                ></canvas>
                <canvas
                    id="src-canvas"
                    ref={canvasRef}
                    width={width * tilesize}
                    height={height * tilesize}
                    style={{ zIndex: 1 }}
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
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "0.8em",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <p>Floor:</p>
                        <p className="hp-num">{world.floor}</p>
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
            <img id="GFG" src="/images/BrickWall_003.png" style={{ display: "none" }} />
            <p style={{ position: "absolute", top: 0, left: 0, color: "#FFF" }}>
                X: {world.player.x}, Y:{world.player.y}
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
