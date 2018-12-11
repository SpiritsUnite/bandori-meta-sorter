namespace order {
    const song_sel = <HTMLSelectElement>document.getElementById("song");
    const diff_sel = <HTMLSelectElement>document.getElementById("diff");
    const display_sel = <HTMLSelectElement>document.getElementById("display");

    interface SongSel {
        song_id: number;
        diff: string;
    }

    function parse_sel() {
        let diff = get_input(diff_sel);
        let ret = {
            song_id: parseInt(get_input(song_sel)),
            diff: diff,
        };

        let params = new URLSearchParams();
        let key: keyof SongSel;
        for (key in ret) params.set(key, ret[key].toString());
        history.replaceState("", "", window.location.pathname + "?" + params.toString())
        return ret;
    }

    function unparse_sel(sel: SongSel) {
        set_input(song_sel, sel.song_id.toString());
        set_input(diff_sel, sel.diff);
    }

    function save_sel() {
        save_field(song_sel);
        save_field(diff_sel);
        save_field(display_sel);
    }

    function load_sel() {
        load_field(song_sel);
        load_field(diff_sel);

        const urlParams = new URLSearchParams(window.location.search);
        let [song_id, diff] = ["song_id", "diff"].map(x => urlParams.get(x));
        if (song_id !== null && diff !== null)
            unparse_sel({song_id: parseInt(song_id), diff: diff});
    }

    // initialises the song picker
    function init_song_list(display: Display) {
        song_sel.innerHTML = "";
        let titles = song_data.map((song) : [Song, string | null] =>
            [song, locale_title(song, display)]
        ).filter((x): x is [Song, string] => x[1] !== null);
        titles.sort((a, b) => a[1].localeCompare(b[1]));
        for (let [song, title] of titles) {
            let option = document.createElement("option");
            option.value = song.song_id.toString();
            option.textContent = title;
            song_sel.add(option);
        }
    }

    // Adds all orders to table
    function add_orders(skills: Skill[], options: Options, sel: SongSel) {
        let song = song_data.filter(song => song.song_id == sel.song_id)[0];
        if (!hasDiff(song.charts, sel.diff)) return;
        let chart = song.charts[sel.diff];
        if (!chart) return;

        let display_fn = (skill: Skill, idx: number) => `${skill_string(skill)} (${chart!.skill[idx][skill.sl]})`;

        let orders = all_mult(chart, skills, options);
        orders.sort((a, b) => b[0] - a[0]);
        for (let [mult, order] of orders) {
            if (options.bp) {
                add_row(...order.map(display_fn), Math.round(mult).toLocaleString());
            } else {
                add_row(...order.map(display_fn), Math.round(mult) + "%");
            }
        }

    }

    let options_ui;

    async function order_init() {
        options_ui = new OptionsUI();
        await options_ui.init();
        let ord_options : Options;

        function gen_orders() {
            save_sel();
            reset_table();
            let sel = parse_sel();
            add_orders(ord_options.skills, ord_options, sel);
        }

        load_field(display_sel);

        init_song_list(parseInt(get_input(display_sel)));

        load_sel();

        options_ui.add_listener(options => { ord_options = options; gen_orders(); });
        song_sel.addEventListener("change", gen_orders);
        diff_sel.addEventListener("change", gen_orders);

        display_sel.addEventListener("change", () => {
            init_song_list(parseInt(get_input(display_sel)));
            load_sel();
            gen_orders();
        });
    }

    order_init();
}