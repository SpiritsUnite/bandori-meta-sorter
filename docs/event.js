"use strict";
let event_data;
async function event_init() {
    event_data = await (await fetch("events.json")).json();
    let event_sel = document.getElementById("event");
    for (let i = 0; i < event_data.length; i++) {
        if (!["challenge_live", "vs_live"].includes(event_data[i].event_type))
            continue;
        let option = document.createElement("option");
        option.value = i.toString();
        option.textContent = event_data[i].name;
        event_sel.add(option);
    }
}
