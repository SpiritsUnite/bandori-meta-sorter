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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var song_sel = document.getElementById("song");
var diff_sel = document.getElementById("diff");
var display_sel = document.getElementById("display");
function parse_sel() {
    var diff = get_input(document.getElementById("diff"));
    var ret = {
        song_id: parseInt(get_input(document.getElementById("song"))),
        diff: diff
    };
    var params = new URLSearchParams();
    var key;
    for (key in ret)
        params.set(key, ret[key].toString());
    history.replaceState("", "", window.location.pathname + "?" + params.toString());
    return ret;
}
function unparse_sel(sel) {
    set_input(document.getElementById("song"), sel.song_id.toString());
    set_input(document.getElementById("diff"), sel.diff);
}
function save_sel() {
    save_field(document.getElementById("song"));
    save_field(document.getElementById("diff"));
    save_field(document.getElementById("display"));
}
function load_sel() {
    load_field(document.getElementById("song"));
    load_field(document.getElementById("diff"));
    var urlParams = new URLSearchParams(window.location.search);
    var _a = __read(["song_id", "diff"].map(function (x) { return urlParams.get(x); }), 2), song_id = _a[0], diff = _a[1];
    if (song_id !== null && diff !== null)
        unparse_sel({ song_id: parseInt(song_id), diff: diff });
}
// initialises the song picker
function init_song_list(display) {
    var e_1, _a;
    song_sel.innerHTML = "";
    var titles = song_data.map(function (song) {
        return [song, locale_title(song, display)];
    }).filter(function (x) { return x[1] !== null; });
    titles.sort(function (a, b) { return a[1].localeCompare(b[1]); });
    try {
        for (var titles_1 = __values(titles), titles_1_1 = titles_1.next(); !titles_1_1.done; titles_1_1 = titles_1.next()) {
            var _b = __read(titles_1_1.value, 2), song = _b[0], title = _b[1];
            var option = document.createElement("option");
            option.value = song.song_id.toString();
            option.textContent = title;
            song_sel.add(option);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (titles_1_1 && !titles_1_1.done && (_a = titles_1["return"])) _a.call(titles_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
// Adds all orders to table
function add_orders(skills, options, sel) {
    var e_2, _a;
    var song = song_data.filter(function (song) { return song.song_id == sel.song_id; })[0];
    if (!hasDiff(song.charts, sel.diff))
        return;
    var chart = song.charts[sel.diff];
    if (!chart)
        return;
    var orders = all_mult(chart, skills, options);
    orders.sort(function (a, b) { return b[0] - a[0]; });
    try {
        for (var orders_1 = __values(orders), orders_1_1 = orders_1.next(); !orders_1_1.done; orders_1_1 = orders_1.next()) {
            var _b = __read(orders_1_1.value, 2), mult = _b[0], order = _b[1];
            if (options.bp) {
                add_song.apply(void 0, __spread(order.map(skill_string), [Math.round(mult).toLocaleString()]));
            }
            else {
                add_song.apply(void 0, __spread(order.map(skill_string), [Math.round(mult) + "%"]));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (orders_1_1 && !orders_1_1.done && (_a = orders_1["return"])) _a.call(orders_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function order_init() {
    return __awaiter(this, void 0, void 0, function () {
        function gen_orders() {
            save_sel();
            reset_table();
            var sel = parse_sel();
            add_orders(ord_options.skills, ord_options, sel);
        }
        var ord_options, display_sel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, load_songs()];
                case 1:
                    song_data = _a.sent();
                    load_field(document.getElementById("display"));
                    init_song_list(parseInt(get_input(document.getElementById("display"))));
                    load_sel();
                    options_init(function (options) { ord_options = options; gen_orders(); });
                    song_sel.addEventListener("change", gen_orders);
                    diff_sel.addEventListener("change", gen_orders);
                    display_sel = document.getElementById("display");
                    display_sel.addEventListener("change", function () {
                        init_song_list(parseInt(get_input(document.getElementById("display"))));
                        load_sel();
                        gen_orders();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
order_init();
