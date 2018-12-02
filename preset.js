"use strict";
var Preset;
(function (Preset) {
    let options_ui;
    const [new_button, delete_button, load_button, save_button, new_confirm, delete_confirm] = ["new-preset-button", "delete-preset-button",
        "load-preset-button", "save-preset-button", "new-preset-confirm",
        "delete-preset-confirm"]
        .map(s => document.getElementById(s));
    const preset_sel = document.getElementById("preset-sel");
    const new_preset_name = document.getElementById("new-preset-name");
    function load_presets() {
        return JSON.parse(localStorage.getItem("presets") || "[]");
    }
    function modify_presets(f) {
        let new_presets = f(load_presets());
        localStorage.setItem("presets", JSON.stringify(new_presets));
        gen_sel(new_presets);
        reset_name_placeholder();
    }
    function gen_sel(presets) {
        let old_idx = preset_sel.selectedIndex;
        preset_sel.innerHTML = "";
        presets.forEach((preset, idx) => {
            preset_sel.add(new Option(preset.name, idx.toString()));
        });
        preset_sel.selectedIndex = old_idx;
    }
    function on_new(name) {
        options_ui.set_options();
        modify_presets(presets => {
            presets.push({ name: name, options: options_ui.options });
            return presets;
        });
    }
    function on_delete() {
        let idx = preset_sel.selectedIndex;
        if (idx == -1)
            return;
        modify_presets(presets => {
            presets.splice(idx, 1);
            return presets;
        });
    }
    function on_load() {
        let idx = preset_sel.selectedIndex;
        if (idx == -1)
            return;
        let presets = load_presets();
        options_ui.set_options(presets[idx].options);
    }
    function on_save() {
        let idx = preset_sel.selectedIndex;
        if (idx == -1)
            return;
        options_ui.set_options();
        modify_presets(presets => {
            presets[idx].options = options_ui.options;
            return presets;
        });
    }
    function reset_name_placeholder() {
        new_preset_name.placeholder = `Preset ${load_presets().length + 1}`;
    }
    function preset_init(o_ui) {
        options_ui = o_ui;
        gen_sel(load_presets());
        reset_name_placeholder();
        window.addEventListener("storage", e => {
            e.key == "presets" && gen_sel(load_presets());
        });
        new_confirm.addEventListener("click", () => {
            on_new(new_preset_name.value || new_preset_name.placeholder);
            new_preset_name.value = "";
        });
        delete_confirm.addEventListener("click", on_delete);
        load_button.addEventListener("click", on_load);
        save_button.addEventListener("click", on_save);
    }
    Preset.preset_init = preset_init;
})(Preset || (Preset = {}));
