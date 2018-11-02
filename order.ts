const song_sel = <HTMLSelectElement>document.getElementById("song");
const diff_sel = <HTMLSelectElement>document.getElementById("diff");

function init_song_list(options: Options) {
    song_sel.innerHTML = "";
    let titles = song_data.map((song) : [Song, string | null] =>
        [song, locale_title(song, options)]
    ).filter((x): x is [Song, string] => x[1] !== null);
    titles.sort((a, b) => a[1].localeCompare(b[1]));
    for (let [song, title] of titles) {
        let option = document.createElement("option");
        option.value = song.song_id.toString();
        option.textContent = title;
        song_sel.add(option);
    }
}

interface SongSel {
    song_id: number;
    diff: string;
}

function add_orders(skills: Skill[], options: Options, sel: SongSel) {
    let song = song_data.filter(song => song.song_id == sel.song_id)[0];
    if (!hasDiff(song.charts, sel.diff)) return;
    let chart = song.charts[sel.diff];
    if (!chart) return;

    let orders = all_mult(chart, skills, options);
    orders.sort((a, b) => a[0] - b[0]);
    for (let [mult, order] of orders) {
        add_song(...order.map(skill_string), Math.round(mult*100) + "%");
    }

}

function parse_sel() {
    let diff = get_input(document.getElementById("diff"));
    let ret = {
        song_id: parseInt(get_input(document.getElementById("song"))),
        diff: diff,
    };

    let params = new URLSearchParams();
    let key: keyof SongSel;
    for (key in ret) params.set(key, ret[key].toString());
    history.replaceState("", "", window.location.pathname + "?" + params.toString())
    return ret;
}

function unparse_sel(sel: SongSel) {
    set_input(document.getElementById("song"), sel.song_id.toString());
    set_input(document.getElementById("diff"), sel.diff);
}

function gen_orders() {
    save_options();
    reset_songs();
    const skills = parse_skills();
    const options = parse_options();
    let sel = parse_sel();
    add_orders(skills, options, sel);
}

async function order_init() {
    load_options();
    song_data = await load_songs();
    const options = parse_options();
    init_song_list(options);
    load_options();

    const urlParams = new URLSearchParams(window.location.search);
    let [song_id, diff] = ["song_id", "diff"].map(x => urlParams.get(x));
    if (song_id !== null && diff !== null)
        unparse_sel({song_id: parseInt(song_id), diff: diff});

    gen_orders();
}

order_init().then(() => {
    song_sel.addEventListener("change", gen_orders);
    diff_sel.addEventListener("change", gen_orders);

    const display_sel = <HTMLSelectElement>document.getElementById("display");
    display_sel.addEventListener("change", () => {save_options(); order_init();});

    const gen_button = <HTMLButtonElement>document.getElementById("gen-button");
    gen_button.addEventListener("click", () => {save_options(); order_init();});
    gen_button.disabled = false;
});