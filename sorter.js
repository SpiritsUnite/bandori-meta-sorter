"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function parse_filters() {
    return {
        diff: new Set(["easy", "normal", "hard", "expert", "special"].filter(function (d) {
            return document.getElementById(d + "-filter").checked;
        })),
        display: parseInt(get_input(document.getElementById("display")))
    };
}
function save_filters() {
    var filter_fields = document.querySelectorAll("#filters input,#filters select");
    for (var i = 0; i < filter_fields.length; i++) {
        save_field(filter_fields[i]);
    }
}
var chart_table;
var chart_options;
function gen_song_table(options) {
    var e_1, _a, e_2, _b;
    var bp = options.bp || 100;
    chart_options = options;
    chart_table = [];
    try {
        for (var song_data_1 = __values(song_data), song_data_1_1 = song_data_1.next(); !song_data_1_1.done; song_data_1_1 = song_data_1.next()) {
            var song = song_data_1_1.value;
            try {
                for (var _c = __values(Object.entries(song.charts)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), diff = _e[0], chart = _e[1];
                    chart && chart_table.push({
                        song: song,
                        chart: chart,
                        diff: diff,
                        min: min_mult(chart, options.skills, options) * bp,
                        avg: avg_mult(chart, options.skills, options) * bp,
                        max: max_mult(chart, options.skills, options) * bp
                    });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (song_data_1_1 && !song_data_1_1.done && (_a = song_data_1["return"])) _a.call(song_data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    display_song_table();
}
var sort_col = 4;
var sort_dir = -1;
function pass_filters(filters, row) {
    if (!filters.diff.has(row.diff))
        return false;
    return true;
}
function display_song_table() {
    var e_3, _a, e_4, _b;
    reset_table();
    var sortable = [];
    var filters = parse_filters();
    save_filters();
    try {
        for (var chart_table_1 = __values(chart_table), chart_table_1_1 = chart_table_1.next(); !chart_table_1_1.done; chart_table_1_1 = chart_table_1.next()) {
            var row = chart_table_1_1.value;
            if (!pass_filters(filters, row))
                continue;
            var title = locale_title(row.song, filters.display);
            title && sortable.push([title, row.diff, row.chart.level, row.min,
                row.avg, row.max, row.song.song_id]);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (chart_table_1_1 && !chart_table_1_1.done && (_a = chart_table_1["return"])) _a.call(chart_table_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    sortable.sort(function (a, b) {
        var _a = __read([a[sort_col], b[sort_col]], 2), ax = _a[0], bx = _a[1];
        if (typeof ax === "string") {
            return ax.localeCompare(bx) * sort_dir;
        }
        else {
            return (ax - bx) * sort_dir;
        }
    });
    var score_end = chart_options.bp ? "" : "%";
    try {
        for (var sortable_1 = __values(sortable), sortable_1_1 = sortable_1.next(); !sortable_1_1.done; sortable_1_1 = sortable_1.next()) {
            var _c = __read(sortable_1_1.value, 7), title = _c[0], diff = _c[1], level = _c[2], min = _c[3], avg = _c[4], max = _c[5], song_id = _c[6];
            add_song([title, "order.html?song_id=" + song_id + "&diff=" + diff], diff, level.toString(), Math.round(min).toLocaleString() + score_end, Math.round(avg).toLocaleString() + score_end, Math.round(max).toLocaleString() + score_end);
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (sortable_1_1 && !sortable_1_1.done && (_b = sortable_1["return"])) _b.call(sortable_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var gen_button, display_sel, thead, cells_1, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    load_all_fields();
                    return [4 /*yield*/, load_songs()];
                case 1:
                    song_data = _a.sent();
                    gen_song_table(parse_options());
                    gen_button = document.getElementById("gen-button");
                    gen_button.addEventListener("click", function () {
                        save_all_fields();
                        gen_song_table(parse_options());
                    });
                    ["easy", "normal", "hard", "expert", "special"].forEach(function (d) {
                        return document.getElementById(d + "-filter")
                            .addEventListener("change", display_song_table);
                    });
                    display_sel = document.getElementById("display");
                    display_sel.addEventListener("change", display_song_table);
                    gen_button.disabled = false;
                    thead = document.querySelector("thead");
                    if (thead) {
                        cells_1 = thead.rows[0].cells;
                        _loop_1 = function (i) {
                            cells_1[i].addEventListener("click", function () {
                                var _a;
                                cells_1[sort_col].lastElementChild.classList.add("invisible");
                                if (i == sort_col)
                                    sort_dir *= -1;
                                else
                                    _a = __read([i, i <= 1 ? 1 : -1], 2), sort_col = _a[0], sort_dir = _a[1];
                                cells_1[i].lastElementChild.textContent = sort_dir === 1 ? "arrow_drop_up" : "arrow_drop_down";
                                cells_1[i].lastElementChild.classList.remove("invisible");
                                display_song_table();
                            });
                        };
                        for (i = 0; i < cells_1.length; i++) {
                            _loop_1(i);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
init();
