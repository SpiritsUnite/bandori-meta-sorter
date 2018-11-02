"use strict";
/// <reference path="./song.ts" />
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
var song_data;
function parse_skills() {
    var e_1, _a;
    var form_ids = __spread(Array(5).keys()).map(function (x) { return ["skill" + x, "sl" + x]; });
    var ret = [];
    try {
        for (var form_ids_1 = __values(form_ids), form_ids_1_1 = form_ids_1.next(); !form_ids_1_1.done; form_ids_1_1 = form_ids_1.next()) {
            var ids = form_ids_1_1.value;
            ret.push({
                mult: parseInt(document.getElementById(ids[0]).value),
                sl: parseInt(document.getElementById(ids[1]).value)
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (form_ids_1_1 && !form_ids_1_1.done && (_a = form_ids_1["return"])) _a.call(form_ids_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return ret;
}
function add_song() {
    var fields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i];
    }
    var table = document.querySelector("#song-list");
    if (table) {
        var row = document.createElement("tr");
        for (var i = 0; i < fields.length; i++) {
            var field_td = document.createElement("td");
            field_td.textContent = fields[i];
            field_td.setAttribute("data-" + i, fields[i]);
            row.appendChild(field_td);
        }
        table.appendChild(row);
    }
}
function reset_songs() {
    var table = document.querySelector("#song-list");
    if (table && table.parentNode) {
        table.parentNode.replaceChild(table.cloneNode(false), table);
    }
}
var Display;
(function (Display) {
    Display[Display["All"] = 0] = "All";
    Display[Display["PreferEn"] = 1] = "PreferEn";
    Display[Display["OnlyEn"] = 2] = "OnlyEn";
})(Display || (Display = {}));
function parse_options() {
    return {
        display: parseInt(document.getElementById("display").value),
        diff: new Set(["easy", "normal", "hard", "expert", "special"].filter(function (d) {
            return document.getElementById(d + "-filter").checked;
        })),
        fever: document.getElementById("fever").checked
    };
}
function add_songs() {
    var e_2, _a;
    var skills = parse_skills();
    var options = parse_options();
    var songs = song_data.map(function (song) { return [avg_mult(song, skills, options.fever), song]; });
    songs.sort().reverse();
    try {
        for (var songs_1 = __values(songs), songs_1_1 = songs_1.next(); !songs_1_1.done; songs_1_1 = songs_1.next()) {
            var _b = __read(songs_1_1.value, 2), mult = _b[0], song = _b[1];
            var title = void 0;
            if (options.display && song.en_title) {
                title = song.en_title;
            }
            else if (options.display == Display.OnlyEn) {
                continue;
            }
            else {
                title = song.title;
            }
            if (!options.diff.has(song.diff))
                continue;
            add_song(title, song.diff, Math.round(mult * 100) + "%");
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (songs_1_1 && !songs_1_1.done && (_a = songs_1["return"])) _a.call(songs_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function load_songs() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("songs.json")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function load_options(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        var d = localStorage.getItem(e.id);
        if (!d) {
            if (e.dataset["default"] !== undefined) {
                d = e.dataset["default"];
            }
            else
                continue;
        }
        if (e instanceof HTMLInputElement) {
            if (e.type === "text") {
                e.value = d;
            }
            else if (e.type === "checkbox") {
                e.checked = JSON.parse(d);
            }
        }
        else if (e instanceof HTMLSelectElement) {
            e.value = d;
        }
    }
}
function save_options(form) {
    for (var i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        if (e instanceof HTMLInputElement) {
            if (e.type === "text") {
                localStorage.setItem(e.id, e.value);
            }
            else if (e.type === "checkbox") {
                localStorage.setItem(e.id, JSON.stringify(e.checked));
            }
        }
        else if (e instanceof HTMLSelectElement) {
            localStorage.setItem(e.id, e.value);
        }
    }
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var form, gen_button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form = document.getElementById("skills");
                    load_options(form);
                    return [4 /*yield*/, load_songs()];
                case 1:
                    song_data = _a.sent();
                    add_songs();
                    form.addEventListener("submit", function (event) {
                        event.preventDefault();
                        save_options(form);
                        reset_songs();
                        add_songs();
                    });
                    gen_button = document.getElementById("gen-button");
                    gen_button.disabled = false;
                    return [2 /*return*/];
            }
        });
    });
}
init();
