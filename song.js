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
var cutoffs = [1, 21, 51, 101, 151, 201, 251, 301, 401, 501, 601, 701, 9999];
function combo(start, end) {
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
function hasDiff(charts, diff) {
    return charts.hasOwnProperty(diff);
}
var Type;
(function (Type) {
    Type[Type["Scorer"] = 0] = "Scorer";
    Type[Type["Hybrid"] = 1] = "Hybrid";
    Type[Type["Support"] = 2] = "Support";
})(Type || (Type = {}));
function locale_title(song, display) {
    if (display && song.en_title) {
        return song.en_title;
    }
    else if (display == Display.OnlyEn) {
        return null;
    }
    else {
        return song.title;
    }
}
function skill_string(skill) {
    return skill.rarity + "* " + skill.mult + "% Lv" + ((skill.sl - 1) % 4 + 2);
}
function base(chart) {
    return 1.1 * (3 + (chart.level - 5) * 0.03);
}
function base_combo(chart) {
    return base(chart) * combo(1, chart.combo + 1);
}
function skill_perms(skills) {
    var ret = [];
    var cmp = function (l, r) { return l.mult - r.mult || l.sl - r.sl; };
    skills = skills.slice();
    skills.sort(cmp);
    ret.push(skills.slice());
    var _loop_1 = function () {
        var _a;
        var k = Math.max.apply(Math, __spread(skills.slice(0, -1).map(function (v, i) { return cmp(v, skills[i + 1]) < 0 ? i : -1; })));
        if (k == -1)
            return "break";
        var l = Math.max.apply(Math, __spread(skills.map(function (v, i) { return cmp(skills[k], v) < 0 ? i : -1; })));
        _a = __read([skills[l], skills[k]], 2), skills[k] = _a[0], skills[l] = _a[1];
        skills = skills.slice(0, k + 1).concat(skills.slice(k + 1).reverse());
        ret.push(skills.slice());
    };
    while (true) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    return ret;
}
function sl_mult(chart, skill, sl) {
    var _a = __read(chart.skill[skill][sl], 2), st = _a[0], num = _a[1];
    return num * base(chart) * combo(st, st + num) / chart.combo;
}
function perm_mult(mult_f, chart, skills) {
    var ret = 0;
    skills.forEach(function (s, i) { return ret += s.mult / 100 * mult_f(chart, i, s.sl); });
    return ret;
}
function perm_sort(mult_f, chart, skills) {
    var perm_list = skill_perms(skills).map(function (ss) {
        return [perm_mult(mult_f, chart, ss), ss];
    });
    return perm_list.sort(function (a, b) { return a[0] - b[0]; });
}
function max_enc(mult_f, chart, skills) {
    var mults = __spread(skills.map(function (s) { return s.mult / 100 * mult_f(chart, 5, s.sl); }));
    return mults.reduce(function (max_idx, x, i) { return x > mults[max_idx] ? i : max_idx; }, 0);
}
function avg_mult_helper(mult_f, base_f) {
    return function (chart, skills, encore) {
        var e_1, _a;
        var c_sum = 0;
        try {
            for (var skills_1 = __values(skills), skills_1_1 = skills_1.next(); !skills_1_1.done; skills_1_1 = skills_1.next()) {
                var skill = skills_1_1.value;
                for (var i = 0; i < 5; i++) {
                    c_sum += skill.mult / 100 * mult_f(chart, i, skill.sl);
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
        var ret = base_f(chart) + c_sum / 5;
        if (encore == -1)
            encore = max_enc(mult_f, chart, skills);
        ret += skills[encore].mult / 100 * mult_f(chart, 5, skills[encore].sl);
        return ret;
    };
}
function fev_mult(chart, start, end) {
    if (start === void 0) { start = -1; }
    if (end === void 0) { end = 9999; }
    start = Math.max(chart.fever[0], start);
    end = Math.min(chart.fever[1], end);
    var num = Math.max(0, end - start);
    return base(chart) * combo(start, end) * num / chart.combo;
}
function sl_mult_fev(chart, skill, sl) {
    var _a = __read(chart.skill[skill][sl], 2), st = _a[0], num = _a[1];
    var fev = fev_mult(chart, st, st + num);
    return num * base(chart) * combo(st, st + num) / chart.combo + fev;
}
function avg_mult(chart, skills, options) {
    return (options.fever ?
        avg_mult_helper(sl_mult_fev, function (chart) { return base_combo(chart) + fev_mult(chart); }) :
        avg_mult_helper(sl_mult, base_combo))(chart, skills, options.encore);
}
function full_skill_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    var ret = base_combo(chart);
    if (options.fever)
        ret += fev_mult(chart);
    var encore = options.encore === -1 ? max_enc(mult_f, chart, options.skills) : options.encore;
    ret += options.skills[encore].mult / 100 * mult_f(chart, 5, options.skills[encore].sl);
    ret += perm_mult(mult_f, chart, skills);
    return ret;
}
function full_skill_mult_exact(chart, skills, options) {
    var e_2, _a, e_3, _b;
    var encore = options.encore;
    if (encore == -1)
        encore = max_enc(options.fever ? sl_mult_fev : sl_mult, chart, skills);
    skills = __spread(skills, [skills[encore]]);
    // types of events
    // combo cutoff, skill act, fever, skill end
    var events = [];
    events.push([chart.combo + 1, "end"]);
    try {
        for (var cutoffs_1 = __values(cutoffs), cutoffs_1_1 = cutoffs_1.next(); !cutoffs_1_1.done; cutoffs_1_1 = cutoffs_1.next()) {
            var c = cutoffs_1_1.value;
            c > 1 && c <= chart.combo && events.push([c, "combo"]);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (cutoffs_1_1 && !cutoffs_1_1.done && (_a = cutoffs_1["return"])) _a.call(cutoffs_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    for (var i = 0; i < 6; i++) {
        var _c = __read(chart.skill[i][skills[i].sl], 2), start = _c[0], notes = _c[1];
        events.push([start, "skill_start"]);
        events.push([start + notes, "skill_end"]);
    }
    if (options.fever) {
        events.push([chart.fever[0], "fever_start"]);
        events.push([chart.fever[1], "fever_end"]);
    }
    events.sort(function (a, b) { return a[0] - b[0]; });
    //floor(floor(bp×3×{(level - 5)×0.01+1}÷combo×1.1×combo_mult)×skill)
    var last = 1;
    var combo_mult = 1;
    var fev_mult = 1;
    var cur_skill = 0;
    var active = [];
    var score = 0;
    var bp = options.bp || 100;
    try {
        for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
            var _d = __read(events_1_1.value, 2), at = _d[0], event_1 = _d[1];
            var skill_mult = active.reduce(function (x, y) { return x * y; }, 1);
            var note_score = (((bp * base(chart) * combo_mult / chart.combo + 0.00001) | 0) * fev_mult * skill_mult + 0.00001) | 0;
            score += (at - last) * note_score;
            last = at;
            if (event_1 === "combo")
                combo_mult += 0.01;
            else if (event_1 === "skill_start")
                active.push((100 + skills[cur_skill++].mult) / 100);
            else if (event_1 === "skill_end")
                active.shift();
            else if (event_1 === "fever_start")
                fev_mult = 2;
            else if (event_1 === "fever_end")
                fev_mult = 1;
            else if (event_1 === "end")
                break;
            else
                (function (x) { throw "oops"; })(event_1);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (events_1_1 && !events_1_1.done && (_b = events_1["return"])) _b.call(events_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return score;
}
function max_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult_exact(chart, perm_sort(mult_f, chart, skills).slice(-1)[0][1], options);
}
function min_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult_exact(chart, perm_sort(mult_f, chart, skills)[0][1], options);
}
function min_max_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    var perms = perm_sort(mult_f, chart, skills);
    return [full_skill_mult_exact(chart, perms[0][1], options),
        full_skill_mult_exact(chart, perms[perms.length - 1][1], options)];
}
function all_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return perm_sort(mult_f, chart, skills).map(function (_a) {
        var _b = __read(_a, 2), mult = _b[0], order = _b[1];
        return [full_skill_mult_exact(chart, order, options), order];
    });
}
