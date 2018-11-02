interface SongSelect {
    song_id: number;
    diff: Diffs;
}

let song_data: Song[];

function parse_skills(): Skill[] {
    const form_ids = [...Array(5).keys()].map(x => ["skill" + x, "sl" + x]);
    let ret = [];
    for (let ids of form_ids) {
        let [mult, type, rarity] = JSON.parse(get_input(document.getElementById(ids[0])));
        let lv = parseInt(get_input(document.getElementById(ids[1])));
        ret.push({
            mult: mult,
            rarity: rarity,
            sl: lv ? lv + 4*type : lv,
        });
    }
    return ret;
}

function add_song(...fields: (string | [string, string])[]) {
    const table = document.querySelector("#song-list");
    if (table) {
        let row = document.createElement("tr");
        for (let i = 0; i < fields.length; i++) {
            let field_td = document.createElement("td");
            let field = fields[i];
            if (typeof field == "string") {
                field_td.textContent = field
                field_td.setAttribute("data-" + i, field);
            } else if (field instanceof Array) {
                let link = document.createElement("a");
                link.classList.add("text-dark");
                [link.textContent, link.href] = field;
                field_td.appendChild(link);
            } else ((a: never): never => a)(field);
            row.appendChild(field_td);
        }
        table.appendChild(row);
    }
}

function reset_songs() {
    const table = document.querySelector("#song-list");
    if (table && table.parentNode) {
        table.parentNode.replaceChild(table.cloneNode(false), table);
    }
}

enum Display {
    All = 0,
    PreferEn = 1,
    OnlyEn = 2,
}

interface Options {
    display: Display;
    fever: boolean;
    encore: number;
}

function parse_options(): Options {
    return {
        display: parseInt(get_input(document.getElementById("display"))),
        fever: (<HTMLInputElement>document.getElementById("fever")).checked,
        encore: parseInt(get_input(document.getElementById("encore"))),
    };
}

async function load_songs() {
    const response = await fetch("songs.json");
    return await response.json();
}

function get_input(e: HTMLElement | null) {
    if (e instanceof HTMLInputElement) {
        if (e.type === "text") return e.value;
        else if (e.type === "checkbox") return JSON.stringify(e.checked);
    }
    else if (e instanceof HTMLSelectElement) return e.value;
    throw "oops";
}

function set_input(e: HTMLElement | null, value: string) {
    if (e instanceof HTMLInputElement) {
        if (e.type === "text") e.value = value;
        else if (e.type === "checkbox") e.checked = JSON.parse(value);
    }
    else if (e instanceof HTMLSelectElement) e.value = value;
}

const fields = document.querySelectorAll("input,select");
function load_options() {
    for (let i = 0; i < fields.length; i++) {
        let e = <HTMLElement>fields[i];
        let d = localStorage.getItem(e.id);
        if (!d) {
            if (e.dataset.default !== undefined) {
                d = e.dataset.default;
            } else continue;
        }
        set_input(e, d);
    }
}

function save_options() {
    for (let i = 0; i < fields.length; i++) {
        let e = <HTMLElement>fields[i];
        let d = get_input(e);
        if (d !== undefined) localStorage.setItem(e.id, d);
    }
}