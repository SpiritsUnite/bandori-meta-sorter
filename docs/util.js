"use strict";
let song_data;
function add_row(...fields) {
    const table = document.querySelector("#song-list");
    if (table) {
        let row = document.createElement("tr");
        for (let i = 0; i < fields.length; i++) {
            let field_td = document.createElement("td");
            let field = fields[i];
            if (typeof field == "string") {
                field_td.textContent = field;
                field_td.setAttribute("data-" + i, field);
            }
            else if (field instanceof Array) {
                let link = document.createElement("a");
                link.classList.add("text-dark");
                [link.textContent, link.href] = field;
                field_td.appendChild(link);
            }
            else
                ((a) => a)(field);
            row.appendChild(field_td);
        }
        table.appendChild(row);
    }
}
function reset_table() {
    const table = document.querySelector("#song-list");
    if (table && table.parentNode) {
        table.parentNode.replaceChild(table.cloneNode(false), table);
    }
}
var Display;
(function (Display) {
    Display[Display["All"] = 0] = "All";
    Display[Display["PreferEn"] = 1] = "PreferEn";
    Display[Display["OnlyEn"] = 2] = "OnlyEn";
})(Display || (Display = {}));
const DEFAULT_OPTIONS = {
    skills: Array(5).fill({ mult: 100, rarity: 4, type: 0, sl: 0 }),
    fever: false,
    bp: 200000,
    encore: -1,
};
class OptionsUI {
    constructor(listeners = []) {
        this.listeners = listeners;
        let saved = localStorage.getItem("options");
        this.set_options(saved === null ? DEFAULT_OPTIONS : JSON.parse(saved));
        const gen_button = document.getElementById("gen-button");
        if (!(gen_button instanceof HTMLButtonElement))
            throw "gen-button not found";
        gen_button.addEventListener("click", () => { this.set_options(); });
        gen_button.disabled = false;
        const opt_fields = document.querySelectorAll("#options input,#options select");
        for (let i = 0; i < opt_fields.length; i++) {
            opt_fields[i].addEventListener("change", e => e.srcElement.classList.add("is-changed"));
        }
        Preset.preset_init(this);
    }
    /**
     * add_listener
     * Adds a listener and calls it with the current options
     */
    add_listener(listener) {
        this.listeners.push(listener);
        listener(this.options);
    }
    get options() {
        return this._options;
    }
    /**
     * set_options
     * Sets the internal options, updating the UI and notifying listeners
     */
    set_options(new_options) {
        this._options = new_options || this.parse_options();
        localStorage.setItem("options", JSON.stringify(this.options));
        this.unparse_options(this.options);
        this.notify_changed();
    }
    notify_changed() {
        for (let listener of this.listeners) {
            listener(this.options);
        }
    }
    parse_skills() {
        let ret = [];
        for (let id = 0; id < 5; id++) {
            let skill_field = document.getElementById(`skill${id}`);
            let sl_field = document.getElementById(`sl${id}`);
            let [mult, type, rarity] = JSON.parse(get_input(skill_field));
            let lv = parseInt(get_input(sl_field));
            ret.push({
                mult: mult,
                rarity: rarity,
                type: type,
                sl: lv ? lv + 4 * type : lv,
            });
        }
        return ret;
    }
    unparse_skills(skills) {
        for (let id = 0; id < 5; id++) {
            let s = skills[id];
            set_input(document.getElementById(`skill${id}`), JSON.stringify([s.mult, s.type, s.rarity]));
            set_input(document.getElementById(`sl${id}`), JSON.stringify(s.sl ? s.sl - 4 * s.type : s.sl));
        }
    }
    parse_options() {
        return {
            skills: this.parse_skills(),
            fever: JSON.parse(get_input(document.getElementById("fever"))),
            bp: parseInt(get_input(document.getElementById("bp"))),
            encore: parseInt(get_input(document.getElementById("encore"))),
        };
    }
    unparse_options(options) {
        this.unparse_skills(options.skills);
        for (let id of ["fever", "bp", "encore"]) {
            let field = document.getElementById(id);
            set_input(field, JSON.stringify(options[id]));
            field.classList.remove("is-changed");
        }
    }
}
async function load_songs() {
    const response = await fetch("songs.json");
    return await response.json();
}
function get_input(e) {
    if (e instanceof HTMLElement)
        e.classList.remove("is-changed");
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number")
            return e.value;
        else if (e.type === "checkbox")
            return JSON.stringify(e.checked);
    }
    else if (e instanceof HTMLSelectElement)
        return e.value;
    throw "oops";
}
function set_input(e, value) {
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number")
            e.value = value;
        else if (e.type === "checkbox")
            e.checked = JSON.parse(value);
    }
    else if (e instanceof HTMLSelectElement)
        e.value = value;
}
function load_field(e) {
    let d = localStorage.getItem(e.id);
    if (!d) {
        if (e.dataset.default !== undefined) {
            d = e.dataset.default;
        }
        else
            return;
    }
    set_input(e, d);
}
function save_field(e) {
    let d = get_input(e);
    if (d !== undefined)
        localStorage.setItem(e.id, d);
}
