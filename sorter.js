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
        }))
    };
}
function add_songs() {
    var e_1, _a, e_2, _b, e_3, _c;
    var skills = parse_skills();
    var options = parse_options();
    var filters = parse_filters();
    var songs = [];
    try {
        for (var song_data_1 = __values(song_data), song_data_1_1 = song_data_1.next(); !song_data_1_1.done; song_data_1_1 = song_data_1.next()) {
            var song = song_data_1_1.value;
            try {
                for (var _d = __values(Object.entries(song.charts)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), diff = _f[0], chart = _f[1];
                    chart && songs.push([
                        song, diff,
                        min_mult(chart, skills, options) * 100,
                        avg_mult(chart, skills, options) * 100,
                        max_mult(chart, skills, options) * 100,
                    ]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
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
    songs.sort(function (a, b) { return b[2] - a[2]; });
    try {
        for (var songs_1 = __values(songs), songs_1_1 = songs_1.next(); !songs_1_1.done; songs_1_1 = songs_1.next()) {
            var _g = __read(songs_1_1.value, 5), song = _g[0], diff = _g[1], min = _g[2], avg = _g[3], max = _g[4];
            if (!filters.diff.has(diff))
                continue;
            var title = locale_title(song, options);
            if (!title)
                continue;
            add_song([title, "order.html?song_id=" + song.song_id + "&diff=" + diff], diff, Math.round(min) + "%", Math.round(avg) + "%", Math.round(max) + "%");
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (songs_1_1 && !songs_1_1.done && (_c = songs_1["return"])) _c.call(songs_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var gen_button, cb;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    load_options();
                    return [4 /*yield*/, load_songs()];
                case 1:
                    song_data = _a.sent();
                    add_songs();
                    gen_button = document.getElementById("gen-button");
                    cb = function () {
                        save_options();
                        reset_songs();
                        add_songs();
                    };
                    gen_button.addEventListener("click", cb);
                    ["easy", "normal", "hard", "expert", "special"].forEach(function (d) {
                        return document.getElementById(d + "-filter")
                            .addEventListener("change", cb);
                    });
                    gen_button.disabled = false;
                    return [2 /*return*/];
            }
        });
    });
}
init();
