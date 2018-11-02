"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
function combo(start, end) {
    var cutoffs = [1, 21, 51, 101, 151, 201, 251, 301, 401, 501, 601, 701, 9999];
    if (end <= start)
        return 0;
    var c_sum = 0;
    var mul = 1;
    for (var i = 0; i < cutoffs.length - 1; i++) {
        if (cutoffs[i + 1] > start && cutoffs[i] < end) {
            c_sum += mul * (Math.min(cutoffs[i + 1], end) - Math.max(cutoffs[i], start));
        }
        mul += 0.01;
    }
    return c_sum / (end - start);
}
function base(song) {
    return 1.1 * (3 + (song.level - 5) * 0.03);
}
function base_combo(song) {
    return base(song) * combo(1, song.combo + 1);
}
function sl_mult(song, skill, sl) {
    var _a = __read(song.skill[skill][sl], 2), st = _a[0], num = _a[1];
    return num * base(song) * combo(st, st + num) / song.combo;
}
function max_enc(mult_f, song, skills) {
    return Math.max.apply(Math, __spread(skills.map(function (s) { return s.mult / 100 * mult_f(song, 5, s.sl); })));
}
function avg_mult_helper(mult_f, base_f) {
    return function (song, skills, encore) {
        var e_1, _a;
        var c_sum = 0;
        try {
            for (var skills_1 = __values(skills), skills_1_1 = skills_1.next(); !skills_1_1.done; skills_1_1 = skills_1.next()) {
                var skill = skills_1_1.value;
                for (var i = 0; i < 5; i++) {
                    c_sum += skill.mult / 100 * mult_f(song, i, skill.sl);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (skills_1_1 && !skills_1_1.done && (_a = skills_1["return"])) _a.call(skills_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var ret = base_f(song) + c_sum / 5;
        if (encore === undefined)
            ret += max_enc(mult_f, song, skills);
        else
            ret += skills[encore].mult / 100 * mult_f(song, 5, skills[encore].sl);
        return ret;
    };
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
function fev_mult(song, start, end) {
    if (start === void 0) { start = -1; }
    if (end === void 0) { end = 9999; }
    start = Math.max(song.fever[0], start);
    end = Math.min(song.fever[1], end);
    var num = Math.max(0, end - start);
    return base(song) * combo(start, end) * num / song.combo;
}
function sl_mult_fev(song, skill, sl) {
    var _a = __read(song.skill[skill][sl], 2), st = _a[0], num = _a[1];
    var fev = fev_mult(song, st, st + num);
    return num * base(song) * combo(st, st + num) / song.combo + fev;
}
function avg_mult(song, skills, fever, encore) {
    return (fever ?
        avg_mult_helper(sl_mult_fev, function (song) { return base_combo(song) + fev_mult(song); }) :
        avg_mult_helper(sl_mult, base_combo))(song, skills, encore);
}
