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

type Diffs = "easy" | "normal" | "hard" | "expert" | "special";

interface Chart {
    level: number;
    combo: number;
    fever: [number, number];
    skill: number[][][]; // skill[which skill][sl] => start x number
}

type Charts = { [d in Diffs]?: Chart };

interface Song {
    song_id: number;
    title: string;
    en_title?: string;
    charts: Charts;
}

function hasDiff(charts: Charts, diff: string): diff is keyof Charts {
    return charts.hasOwnProperty(diff);
}

enum Type {
    Scorer = 0,
    Hybrid,
    Support,
}

interface Skill {
    mult: number;
    rarity: number;
    sl: number;
}

function locale_title(song: Song, options: Options): string | null {
    if (options.display && song.en_title) {
        return song.en_title;
    } else if (options.display == Display.OnlyEn) {
        return null;
    } else {
        return song.title;
    }
}

function skill_string(skill: Skill): string {
    return `${skill.rarity}* ${skill.mult}% Lv${(skill.sl - 1) % 4 + 2}`
}

function base(chart: Chart) {
    return 1.1 * (3 + (chart.level - 5) * 0.03);
}

function base_combo(chart: Chart) {
    return base(chart) * combo(1, chart.combo + 1);
}

function* skill_perms(skills: Skill[]) {
    let cmp = (l: Skill, r: Skill) => l.mult - r.mult || l.sl - r.sl;
    skills.sort(cmp);
    yield skills.slice();
    while (true) {
        let k = Math.max(...skills.slice(0,-1).map((v, i) => cmp(v, skills[i+1]) < 0 ? i : -1));
        if (k == -1) return;
        let l = Math.max(...skills.map((v, i) => cmp(skills[k], v) < 0 ? i : -1));
        [skills[k], skills[l]] = [skills[l], skills[k]];
        skills = skills.slice(0,k+1).concat(skills.slice(k+1).reverse());
        yield skills.slice();
    }
}

type MultF = (chart: Chart, skill: number, sl: number) => number;

function sl_mult(chart: Chart, skill: number, sl: number) {
    let [st, num] = chart.skill[skill][sl];
    return num * base(chart) * combo(st, st + num) / chart.combo;
}

function perm_mult(mult_f: MultF, chart: Chart, skills: Skill[]) {
    let ret = 0;
    skills.forEach((s, i) => ret += s.mult / 100 * mult_f(chart, i, s.sl));
    return ret;
}

function perm_sort(mult_f: MultF, chart: Chart, skills: Skill[]) {
    let perm_list = [...skill_perms(skills)].map((ss): [number, Skill[]] =>
        [perm_mult(mult_f, chart, ss), ss]);
    return perm_list.sort((a, b) => a[0] - b[0]);
}

function max_enc(mult_f: MultF, chart: Chart, skills: Skill[]) {
    return Math.max(...skills.map(s => s.mult / 100 * mult_f(chart, 5, s.sl)));
}

function avg_mult_helper(mult_f: MultF, base_f: (chart: Chart) => number) {
    return function(chart: Chart, skills: Skill[], encore: number) {
        let c_sum = 0;
        for (let skill of skills) {
            for (let i = 0; i < 5; i++) {
                c_sum += skill.mult / 100 * mult_f(chart, i, skill.sl);
            }
        }
        let ret = base_f(chart) + c_sum/5;
        if (encore === -1) ret += max_enc(mult_f, chart, skills);
        else ret += skills[encore].mult / 100 * mult_f(chart, 5, skills[encore].sl);
        return ret;
    }
}

function fev_mult(chart: Chart, start = -1, end = 9999) {
    start = Math.max(chart.fever[0], start);
    end = Math.min(chart.fever[1], end);
    let num = Math.max(0, end - start);
    return base(chart) * combo(start, end) * num / chart.combo;
}

function sl_mult_fev(chart: Chart, skill: number, sl: number) {
    let [st, num] = chart.skill[skill][sl];
    let fev = fev_mult(chart, st, st + num);
    return num * base(chart) * combo(st, st + num) / chart.combo + fev;
}

function avg_mult(chart: Chart, skills: Skill[], options: Options) {
    return (options.fever ?
        avg_mult_helper(sl_mult_fev, (chart) => base_combo(chart) + fev_mult(chart)) :
        avg_mult_helper(sl_mult, base_combo)
    )(chart, skills, options.encore);
}

function full_skill_mult(chart: Chart, skills: Skill[], options: Options) {
    const mult_f = options.fever ? sl_mult_fev : sl_mult;
    let ret = base_combo(chart);
    if (options.fever) ret += fev_mult(chart);
    if (options.encore === -1)
        ret += max_enc(mult_f, chart, skills);
    else
        ret += skills[options.encore].mult / 100 * mult_f(chart, 5, skills[options.encore].sl);
    ret += perm_mult(mult_f, chart, skills);
    return ret;
}

function max_mult(chart: Chart, skills: Skill[], options: Options) {
    const mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult(chart,
        perm_sort(mult_f, chart, skills).slice(-1)[0][1], options);
}

function min_mult(chart: Chart, skills: Skill[], options: Options) {
    const mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult(chart,
        perm_sort(mult_f, chart, skills)[0][1], options);
}

function all_mult(chart: Chart, skills: Skill[], options: Options) {
    const mult_f = options.fever ? sl_mult_fev : sl_mult;
    return perm_sort(mult_f, chart, skills).map(
        ([mult, order]): [number, Skill[]] =>
        [full_skill_mult(chart, order, options), order]);
}