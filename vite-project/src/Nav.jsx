import React from "react";

function Nav(props) {
    return (
        <div style={{ margin: "10px" }}>
            <h1>
                current filter <u>{props.filter}</u>
            </h1>
            <button onClick={() => props.setFilter("all")}>All</button>
            <button onClick={() => props.setFilter("dog")}>dog</button>
            <button onClick={() => props.setFilter("cat")}>cat</button>
            <button onClick={() => props.setFilter("lizard")}>lizard</button>
        </div>
    );
}

export default Nav;
