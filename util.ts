let song_data: Song[];

function parse_skills(): Skill[] {
    let ret = [];
    for (let id = 0; id < 5; id++) {
        let skill_field = document.getElementById(`skill${id}`)
        let sl_field = document.getElementById(`sl${id}`)
        let [mult, type, rarity] = JSON.parse(get_input(skill_field));
        let lv = parseInt(get_input(sl_field));
        ret.push({
            mult: mult,
            rarity: rarity,
            type: type,
            sl: lv ? lv + 4*type : lv,
        });
    }
    return ret;
}

function unparse_skills(skills: Skill[]): void {
    for (let id = 0; id < 5; id++) {
        let s = skills[id];
        set_input(document.getElementById(`skill${id}`),
            JSON.stringify([s.mult, s.type, s.rarity]));
        set_input(document.getElementById(`sl${id}`),
            JSON.stringify(s.sl ? s.sl - 4*s.type : s.sl));
    }
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

function reset_table() {
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
    skills: Skill[];
    fever: boolean;
    bp: number;
    encore: number;
}
const DEFAULT_OPTIONS: Options = {
    skills: Array(5).fill({mult: 100, rarity: 4, type: 0, sl: 0}),
    fever: true,
    bp: 200000,
    encore: -1,
};

function parse_options(): Options {
    return {
        skills: parse_skills(),
        fever: JSON.parse(get_input(document.getElementById("fever"))),
        bp: parseInt(get_input(document.getElementById("bp"))),
        encore: parseInt(get_input(document.getElementById("encore"))),
    };
}

function unparse_options(options: Options): void {
    unparse_skills(options.skills);
    for (let id of <(keyof Options)[]>["fever", "bp", "encore"]) {
        let field = document.getElementById(id);
        set_input(field, JSON.stringify(options[id]));
        field!.classList.remove("is-changed");
    }
}

function options_init(on_change: (options: Options) => void): void {
    let saved = localStorage.getItem("options");
    let saved_opts = saved === null ? DEFAULT_OPTIONS : JSON.parse(saved);
    unparse_options(saved_opts);
    on_change(saved_opts);

    const gen_button = document.getElementById("gen-button");
    if (!(gen_button instanceof HTMLButtonElement)) throw "gen-button not found";
    gen_button.addEventListener("click", () => {
        let options = parse_options();
        localStorage.setItem("options", JSON.stringify(options));
        on_change(options);
    })
    gen_button.disabled = false;

    for (let i = 0; i < opt_fields.length; i++) {
        opt_fields[i].addEventListener("change", e => e.srcElement!.classList.add("is-changed"));
    }
}

async function load_songs() {
    const response = await fetch("songs.json");
    return await response.json();
}

function get_input(e: HTMLElement | null): string {
    if (e instanceof HTMLElement) e.classList.remove("is-changed");
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number") return e.value;
        else if (e.type === "checkbox") return JSON.stringify(e.checked);
    }
    else if (e instanceof HTMLSelectElement) return e.value;
    throw "oops";
}

function set_input(e: HTMLElement | null, value: string) {
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number") e.value = value;
        else if (e.type === "checkbox") e.checked = JSON.parse(value);
    }
    else if (e instanceof HTMLSelectElement) e.value = value;
}

const fields = document.querySelectorAll("input,select");
const opt_fields = document.querySelectorAll("#options input,#options select");
function load_field(e: HTMLElement) {
    let d = localStorage.getItem(e.id);
    if (!d) {
        if (e.dataset.default !== undefined) {
            d = e.dataset.default;
        } else return;
    }
    set_input(e, d);
}

function load_all_fields() {
    for (let i = 0; i < fields.length; i++) {
        load_field(<HTMLElement>fields[i]);
    }

    for (let i = 0; i < opt_fields.length; i++) {
        opt_fields[i].addEventListener("change", e => e.srcElement!.classList.add("is-changed"));
    }
}

function save_field(e: HTMLElement) {
    let d = get_input(e);
    if (d !== undefined) localStorage.setItem(e.id, d);
}

function save_all_fields() {
    for (let i = 0; i < fields.length; i++) {
        save_field(<HTMLElement>fields[i]);
    }

    for (let i = 0; i < opt_fields.length; i++) {
        opt_fields[i].classList.remove("is-changed");
    }
}