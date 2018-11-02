interface Filters {
    diff: Set<string>;
}

function parse_filters(): Filters {
    return {
        diff: new Set(["easy", "normal", "hard", "expert", "special"].filter(d =>
            (<HTMLInputElement>document.getElementById(d + "-filter")).checked)),
    };
}

function add_songs() {
    const skills = parse_skills();
    const options = parse_options();
    const filters = parse_filters();

    let songs : [Song, string, number, number, number][] = []
    for (let song of song_data) {
        for (let [diff, chart] of Object.entries(song.charts)) {
            chart && songs.push([
                song, diff,
                min_mult(chart, skills, options) * 100,
                avg_mult(chart, skills, options) * 100,
                max_mult(chart, skills, options) * 100,
            ]);
        }
    }

    songs.sort((a, b) => b[2] - a[2]);
    for (let [song, diff, min, avg, max] of songs) {
        if (!filters.diff.has(diff)) continue;
        let title = locale_title(song, options);
        if (!title) continue;
        add_song([title, `order.html?song_id=${song.song_id}&diff=${diff}`], diff, Math.round(min) + "%", Math.round(avg) + "%",
            Math.round(max) + "%");
    }
}

async function init() {
    load_options();
    song_data = await load_songs();
    add_songs();

    const gen_button = <HTMLButtonElement>document.getElementById("gen-button");
    const cb = function() {
        save_options();
        reset_songs();
        add_songs();
    }
    gen_button.addEventListener("click", cb);
    ["easy", "normal", "hard", "expert", "special"].forEach(d =>
        (<HTMLInputElement>document.getElementById(d + "-filter"))
        .addEventListener("change", cb));

    gen_button.disabled = false;
}

init()
