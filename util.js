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
var song_data;
function add_row() {
    var fields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fields[_i] = arguments[_i];
    }
    var _a;
    var table = document.querySelector("#song-list");
    if (table) {
        var row = document.createElement("tr");
        for (var i = 0; i < fields.length; i++) {
            var field_td = document.createElement("td");
            var field = fields[i];
            if (typeof field == "string") {
                field_td.textContent = field;
                field_td.setAttribute("data-" + i, field);
            }
            else if (field instanceof Array) {
                var link = document.createElement("a");
                link.classList.add("text-dark");
                _a = __read(field, 2), link.textContent = _a[0], link.href = _a[1];
                field_td.appendChild(link);
            }
            else
                (function (a) { return a; })(field);
            row.appendChild(field_td);
        }
        table.appendChild(row);
    }
}
function reset_table() {
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
var DEFAULT_OPTIONS = {
    skills: Array(5).fill({ mult: 100, rarity: 4, type: 0, sl: 0 }),
    fever: true,
    bp: 200000,
    encore: -1
};
function parse_skills() {
    var ret = [];
    for (var id = 0; id < 5; id++) {
        var skill_field = document.getElementById("skill" + id);
        var sl_field = document.getElementById("sl" + id);
        var _a = __read(JSON.parse(get_input(skill_field)), 3), mult = _a[0], type = _a[1], rarity = _a[2];
        var lv = parseInt(get_input(sl_field));
        ret.push({
            mult: mult,
            rarity: rarity,
            type: type,
            sl: lv ? lv + 4 * type : lv
        });
    }
    return ret;
}
function unparse_skills(skills) {
    for (var id = 0; id < 5; id++) {
        var s = skills[id];
        set_input(document.getElementById("skill" + id), JSON.stringify([s.mult, s.type, s.rarity]));
        set_input(document.getElementById("sl" + id), JSON.stringify(s.sl ? s.sl - 4 * s.type : s.sl));
    }
}
function parse_options() {
    return {
        skills: parse_skills(),
        fever: JSON.parse(get_input(document.getElementById("fever"))),
        bp: parseInt(get_input(document.getElementById("bp"))),
        encore: parseInt(get_input(document.getElementById("encore")))
    };
}
function unparse_options(options) {
    var e_1, _a;
    unparse_skills(options.skills);
    try {
        for (var _b = __values(["fever", "bp", "encore"]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var id = _c.value;
            var field = document.getElementById(id);
            set_input(field, JSON.stringify(options[id]));
            field.classList.remove("is-changed");
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
function options_init(on_change) {
    var saved = localStorage.getItem("options");
    var saved_opts = saved === null ? DEFAULT_OPTIONS : JSON.parse(saved);
    unparse_options(saved_opts);
    on_change(saved_opts);
    var gen_button = document.getElementById("gen-button");
    if (!(gen_button instanceof HTMLButtonElement))
        throw "gen-button not found";
    gen_button.addEventListener("click", function () {
        var options = parse_options();
        localStorage.setItem("options", JSON.stringify(options));
        on_change(options);
    });
    gen_button.disabled = false;
    var opt_fields = document.querySelectorAll("#options input,#options select");
    for (var i = 0; i < opt_fields.length; i++) {
        opt_fields[i].addEventListener("change", function (e) { return e.srcElement.classList.add("is-changed"); });
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
function get_input(e) {
    if (e instanceof HTMLElement)
        e.classList.remove("is-changed");
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number")
            return e.value;
        else if (e.type === "checkbox")
            return JSON.stringify(e.checked);
    }
    else if (e instanceof HTMLSelectElement)
        return e.value;
    throw "oops";
}
function set_input(e, value) {
    if (e instanceof HTMLInputElement) {
        if (e.type === "text" || e.type === "number")
            e.value = value;
        else if (e.type === "checkbox")
            e.checked = JSON.parse(value);
    }
    else if (e instanceof HTMLSelectElement)
        e.value = value;
}
function load_field(e) {
    var d = localStorage.getItem(e.id);
    if (!d) {
        if (e.dataset["default"] !== undefined) {
            d = e.dataset["default"];
        }
        else
            return;
    }
    set_input(e, d);
}
function save_field(e) {
    var d = get_input(e);
    if (d !== undefined)
        localStorage.setItem(e.id, d);
}
