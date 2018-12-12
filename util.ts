let song_data: Song[];

function add_row(...fields: (string | [string, string])[]) {
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
    cards: (Card | undefined)[];
    event: number;
}
const DEFAULT_OPTIONS: Options = {
    skills: Array(5).fill({mult: 100, rarity: 4, type: 0, sl: 0}),
    fever: false,
    bp: 200000,
    encore: -1,
    cards: [],
    event: -1,
};

type OptionsCB = (options: Options) => void;

class OptionsUI {
    // this field is set in the constructor when it calls this.set_options, but
    // the compiler gets confused by the indirection
    private _options!: Options;

    constructor(private listeners: OptionsCB[] = []) {}

    public async init() {
        let inits = [card_init(), event_init()];
        song_data = await load_songs();
        await Promise.all(inits);
        
        let saved = localStorage.getItem("options");
        this.set_options(saved === null ? DEFAULT_OPTIONS : JSON.parse(saved));

        const gen_button = document.getElementById("gen-button");
        if (!(gen_button instanceof HTMLButtonElement))
            throw "gen-button not found";
        gen_button.addEventListener("click", () => { this.set_options(); });
        gen_button.disabled = false;

        const bp_button = document.getElementById("bp-button");
        if (!(bp_button instanceof HTMLButtonElement))
            throw "bp-button not found";
        bp_button.addEventListener("click", () => { this.calc_bp(); this.set_options(); });
        bp_button.disabled = false;

        const opt_fields = document.querySelectorAll("#options input,#options select");
        for (let i = 0; i < opt_fields.length; i++) {
            opt_fields[i].addEventListener("change", e => e.srcElement!.classList.add("is-changed"));
        }
        Preset.preset_init(this);
    }

    /**
     * add_listener
     * Adds a listener and calls it with the current options
     */
    public add_listener(listener: OptionsCB) {
        this.listeners.push(listener);
        listener(this.options);
    }

    get options(): Options {
        return this._options;
    }

    /**
     * set_options
     * Sets the internal options, updating the UI and notifying listeners
     */
    public set_options(new_options?: Options) {
        this._options = new_options || this.parse_options();
        localStorage.setItem("options", JSON.stringify(this.options));
        this.unparse_options(this.options);
        this.notify_changed();
    }

    private notify_changed() {
        for (let listener of this.listeners) {
            listener(this.options);
        }
    }

    private parse_skills(): Skill[] {
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
                sl: lv ? lv + 4*type : lv,
            });
        }
        return ret;
    }

    private unparse_skills(skills: Skill[]): void {
        for (let id = 0; id < 5; id++) {
            let s = skills[id];
            let skill_field = document.getElementById(`skill${id}`);
            let sl_field = document.getElementById(`sl${id}`);
            set_input(skill_field, JSON.stringify([s.mult, s.type, s.rarity]));
            set_input(sl_field, JSON.stringify(s.sl ? s.sl - 4*s.type : s.sl));
            skill_field!.classList.remove("is-changed");
            sl_field!.classList.remove("is-changed");
        }
    }

    private parse_cards(): (Card | undefined)[] {
        let ret = [];
        for (let i = 0; i < 5; i++) {
            let card_btn = document.getElementById(`card${i}`);
            ret.push(card_data.get(parseInt(get_input(card_btn))));
        }
        return ret;
    }

    private unparse_cards(band: (Card | undefined)[] = []): void {
        for (let i = 0; i < 5; i++) {
            let card_btn = <HTMLButtonElement>document.getElementById(`card${i}`);
            let card = band[i];
            if (card) {
                card_btn.value = card.cardId.toString();
                card_btn.textContent = card_str(card);
            } else {
                card_btn.value = "-1";
                card_btn.textContent = "Select card...";
            }
        }
    }

    private parse_options(): Options {
        return {
            skills: this.parse_skills(),
            fever: JSON.parse(get_input(document.getElementById("fever"))),
            bp: parseInt(get_input(document.getElementById("bp"))),
            encore: parseInt(get_input(document.getElementById("encore"))),
            cards: this.parse_cards(),
            event: parseInt(get_input(document.getElementById("event"))),
        };
    }

    private unparse_options(options: Options): void {
        this.unparse_skills(options.skills);
        this.unparse_cards(options.cards);
        for (let id of <(keyof Options)[]>["fever", "bp", "encore", "event"]) {
            let field = document.getElementById(id);
            set_input(field, JSON.stringify(options[id]));
            field!.classList.remove("is-changed");
        }
    }

    private calc_bp(): void {
        let options = this.parse_options();
        set_input(document.getElementById("bp"),
            band_bp(options.cards, event_data[options.event]).toString());
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
    else if (e instanceof HTMLSelectElement ||
        e instanceof HTMLButtonElement) return e.value;
    throw "oops";
}

function set_input(e: HTMLElement | null, value: string): void {
    if (!value && e && e.dataset.default) value = e.dataset.default;
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number") e.value = value;
        else if (e.type === "checkbox") e.checked = JSON.parse(value);
    }
    else if (e instanceof HTMLSelectElement ||
        e instanceof HTMLButtonElement) e.value = value;
}

function load_field(e: HTMLElement) {
    let d = localStorage.getItem(e.id);
    if (!d) {
        if (e.dataset.default !== undefined) {
            d = e.dataset.default;
        } else return;
    }
    set_input(e, d);
}

function save_field(e: HTMLElement) {
    let d = get_input(e);
    if (d !== undefined) localStorage.setItem(e.id, d);
}