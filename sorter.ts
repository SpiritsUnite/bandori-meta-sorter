/// <reference path="./song.ts" />

let song_data: Song[];

function parse_skills() {
  const form_ids = [...Array(5).keys()].map(x => ["skill" + x, "sl" + x]);
  let ret = [];
  for (let ids of form_ids) {
    ret.push({
      mult: parseInt((<HTMLInputElement>document.getElementById(ids[0])).value),
      sl: parseInt((<HTMLInputElement>document.getElementById(ids[1])).value),
    });
  }
  return ret;
}

function add_song(...fields: string[]) {
  const table = document.querySelector("#song-list");
  if (table) {
    let row = document.createElement("tr");
    for (let i = 0; i < fields.length; i++) {
      let field_td = document.createElement("td");
      field_td.textContent = fields[i];
      field_td.setAttribute("data-"+i, fields[i]);
      row.appendChild(field_td);
    }
    table.appendChild(row);
  }
}

function reset_songs() {
  const table = document.querySelector("#song-list");
  if (table && table.parentNode) {
    table.parentNode.replaceChild(table.cloneNode(false), table);
  }
}

enum Display {
  All = 0,
  PreferEn = 1,
  OnlyEn = 2,
}

interface Options {
  display: Display;
  diff: Set<string>;
  fever: boolean;
}

function parse_options(): Options {
  return {
    display: parseInt((<HTMLInputElement>document.getElementById("display")).value),
    diff: new Set(["easy", "normal", "hard", "expert", "special"].filter(d =>
      (<HTMLInputElement>document.getElementById(d + "-filter")).checked)),
    fever: (<HTMLInputElement>document.getElementById("fever")).checked,
  };
}

function add_songs() {
  const skills = parse_skills();
  const options = parse_options();

  let songs: [number, Song][] = song_data.map(
    (song: Song): [number, Song] => [avg_mult(song, skills, options.fever), song]
  );
  songs.sort().reverse();
  for (let [mult, song] of songs) {
    let title;
    if (options.display && song.en_title) {
      title = song.en_title;
    } else if (options.display == Display.OnlyEn) {
      continue;
    } else {
      title = song.title;
    }
    if (!options.diff.has(song.diff)) continue;
    add_song(title, song.diff, Math.round(mult * 100) + "%");
  }
}

async function load_songs() {
  const response = await fetch("songs.json");
  return await response.json();
}

function load_options(form: HTMLFormElement) {
  for (let i = 0; i < form.elements.length; i++) {
    let e = <HTMLElement>form.elements[i];
    let d = localStorage.getItem(e.id);
    if (!d) {
      if (e.dataset.default !== undefined) {
        d = e.dataset.default;
      } else continue;
    }
    if (e instanceof HTMLInputElement)  {
      if (e.type === "text") { e.value = d; }
      else if (e.type === "checkbox") {
        e.checked = JSON.parse(d);
      }
    } else if (e instanceof HTMLSelectElement) {
      e.value = d;
    }
  }
}

function save_options(form: HTMLFormElement) {
  for (let i = 0; i < form.elements.length; i++) {
    let e = <HTMLElement>form.elements[i];
    if (e instanceof HTMLInputElement) {
      if (e.type === "text") { localStorage.setItem(e.id, e.value); }
      else if (e.type === "checkbox") {
        localStorage.setItem(e.id, JSON.stringify(e.checked));
      }
    } else if (e instanceof HTMLSelectElement) {
      localStorage.setItem(e.id, e.value);
    }
  }
}

async function init() {
  const form = <HTMLFormElement>document.getElementById("skills");
  load_options(form);
  song_data = await load_songs();
  add_songs();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    save_options(form);
    reset_songs();
    add_songs();
  });

  const gen_button = <HTMLButtonElement>document.getElementById("gen-button");
  gen_button.disabled = false;
}

init()
