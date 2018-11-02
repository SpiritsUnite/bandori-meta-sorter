function combo(start: number, end: number) {
    const cutoffs = [1, 21, 51, 101, 151, 201, 251, 301, 401, 501, 601, 701, 9999];
    if (end <= start) return 0;
    let c_sum = 0;
    let mul = 1;
    for (let i = 0; i < cutoffs.length - 1; i++) {
        if (cutoffs[i+1] > start && cutoffs[i] < end) {
            c_sum += mul * (Math.min(cutoffs[i+1], end) - Math.max(cutoffs[i], start));
        }
        mul += 0.01;
    }
    return c_sum / (end - start);
}

interface Song {
    song_id: number;
    title: string;
    en_title?: string;
    level: number;
    diff: string;
    combo: number;
    fever: [number, number];
    skill: number[][][]; // skill[which skill][sl] => start x number
}

interface Skill {
    mult: number;
    sl: number;
}

function base(song: Song) {
    return 1.1 * (3 + (song.level - 5) * 0.03);
}

function base_combo(song: Song) {
    return base(song) * combo(1, song.combo + 1);
}

type MultF = (song: Song, skill: number, sl: number) => number;

function sl_mult(song: Song, skill: number, sl: number) {
    let [st, num] = song.skill[skill][sl];
    return num * base(song) * combo(st, st + num) / song.combo;
}

function max_enc(mult_f: MultF, song: Song, skills: Skill[]) {
    return Math.max(...skills.map(s => s.mult / 100 * mult_f(song, 5, s.sl)));
}

function avg_mult_helper(mult_f: MultF, base_f: (song: Song) => number) {
    return function(song: Song, skills: Skill[], encore?: number) {
        let c_sum = 0;
        for (let skill of skills) {
            for (let i = 0; i < 5; i++) {
                c_sum += skill.mult / 100 * mult_f(song, i, skill.sl);
            }
        }
        let ret = base_f(song) + c_sum/5;
        if (encore === undefined) ret += max_enc(mult_f, song, skills);
        else ret += skills[encore].mult / 100 * mult_f(song, 5, skills[encore].sl);
        return ret;
    }
}

// function avg_mult(song: Song, skills: Skill[]) {
    // let c_sum = 0;
    // for (let skill of skills) {
        // for (let i = 0; i < 5; i++) {
            // c_sum += skill.mult / 100 * sl_mult(song, i, skill.sl);
        // }
    // }
    // return base_combo(song) + c_sum/5 + max_enc(song, skills);
// }

function fev_mult(song: Song, start = -1, end = 9999) {
    start = Math.max(song.fever[0], start);
    end = Math.min(song.fever[1], end);
    let num = Math.max(0, end - start);
    return base(song) * combo(start, end) * num / song.combo;
}

function sl_mult_fev(song: Song, skill: number, sl: number) {
    let [st, num] = song.skill[skill][sl];
    let fev = fev_mult(song, st, st + num);
    return num * base(song) * combo(st, st + num) / song.combo + fev;
}

function avg_mult(song: Song, skills: Skill[], fever: boolean, encore?: number) {
    return (fever ?
        avg_mult_helper(sl_mult_fev, (song) => base_combo(song) + fev_mult(song)) :
        avg_mult_helper(sl_mult, base_combo)
    )(song, skills, encore);
}