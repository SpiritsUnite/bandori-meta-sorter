"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function hasDiff(charts, diff) {
    return charts.hasOwnProperty(diff);
}
var Type;
(function (Type) {
    Type[Type["Scorer"] = 0] = "Scorer";
    Type[Type["Hybrid"] = 1] = "Hybrid";
    Type[Type["Support"] = 2] = "Support";
})(Type || (Type = {}));
function locale_title(song, options) {
    if (options.display && song.en_title) {
        return song.en_title;
    }
    else if (options.display == Display.OnlyEn) {
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
    var cmp, _loop_1, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cmp = function (l, r) { return l.mult - r.mult || l.sl - r.sl; };
                skills.sort(cmp);
                return [4 /*yield*/, skills.slice()];
            case 1:
                _a.sent();
                _loop_1 = function () {
                    var _a, k, l;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                k = Math.max.apply(Math, __spread(skills.slice(0, -1).map(function (v, i) { return cmp(v, skills[i + 1]) < 0 ? i : -1; })));
                                if (k == -1)
                                    return [2 /*return*/, { value: void 0 }];
                                l = Math.max.apply(Math, __spread(skills.map(function (v, i) { return cmp(skills[k], v) < 0 ? i : -1; })));
                                _a = __read([skills[l], skills[k]], 2), skills[k] = _a[0], skills[l] = _a[1];
                                skills = skills.slice(0, k + 1).concat(skills.slice(k + 1).reverse());
                                return [4 /*yield*/, skills.slice()];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 2;
            case 2:
                if (!true) return [3 /*break*/, 4];
                return [5 /*yield**/, _loop_1()];
            case 3:
                state_1 = _a.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/];
        }
    });
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
    var perm_list = __spread(skill_perms(skills)).map(function (ss) {
        return [perm_mult(mult_f, chart, ss), ss];
    });
    return perm_list.sort(function (a, b) { return a[0] - b[0]; });
}
function max_enc(mult_f, chart, skills) {
    return Math.max.apply(Math, __spread(skills.map(function (s) { return s.mult / 100 * mult_f(chart, 5, s.sl); })));
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
        if (encore === -1)
            ret += max_enc(mult_f, chart, skills);
        else
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
    if (options.encore === -1)
        ret += max_enc(mult_f, chart, skills);
    else
        ret += skills[options.encore].mult / 100 * mult_f(chart, 5, skills[options.encore].sl);
    ret += perm_mult(mult_f, chart, skills);
    return ret;
}
function max_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult(chart, perm_sort(mult_f, chart, skills).slice(-1)[0][1], options);
}
function min_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return full_skill_mult(chart, perm_sort(mult_f, chart, skills)[0][1], options);
}
function all_mult(chart, skills, options) {
    var mult_f = options.fever ? sl_mult_fev : sl_mult;
    return perm_sort(mult_f, chart, skills).map(function (_a) {
        var _b = __read(_a, 2), mult = _b[0], order = _b[1];
        return [full_skill_mult(chart, order, options), order];
    });
}
