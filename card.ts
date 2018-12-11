let names = ["Kasumi", "Tae", "Rimi", "Saya", "Arisa",
             "Ran", "Moca", "Himari", "Tomoe", "Tsugumi",
             "Kokoro", "Kaoru", "Hagumi", "Kanon", "Misaki",
             "Aya", "Hina", "Chisato", "Maya", "Eve",
             "Yukina", "Sayo", "Lisa", "Ako", "Rinko"];

interface Card {
    cardId: number;
    characterId: number;
    rarity: number;
    attr: string;
    title: string;
    titleEn?: string;
    maxPerformance: number;
    maxTechnique: number;
    maxVisual: number;
    totalMaxParam: number;
    skill: { skillId: number; };
    episodes: any;
    training: any;
    releasedAt: number;
}

let SKILL_MAP = ["", "[10,0,1]", "[30,0,2]", "[60,0,3]", "[100,0,4]",
                 "[10,2,2]", "[20,2,3]", "[40,2,4]", "[10,2,2]",
                 "[20,2,3]", "[40,2,4]", "[30,1,3]", "[60,1,4]",
                 "[30,1,3]", "[60,1,4]", "", "", "[65,0,3]",
                 "[110,0,4]", "", "[115,0,4]", "[40,0,3]", "[80,0,4]"];

let STORY_BONUS = [0, 900, 1350, 2100, 2550];
let BAND_MULT = 0.425;
let ATTR_MULT = 0.2;

function card_str(card: Card): string {
    return `${card.rarity}* ${card.attr} ${names[card.characterId-1]} ${card.titleEn || card.title}`;
}

let card_data : Map<number, Card> = new Map();

function card_bp(card: Card): number {
    let ret = card.totalMaxParam;
    if (card.episodes) {
        for (let entry of card.episodes.entries) {
            ret += entry.appendVisual*3;
        }
    }
    if (card.training) {
        ret += card.training.trainingVisual*3;
    }
    return ret;
}

function band_bp(band: (Card | undefined)[]): number {
    let band_v: number[] = Array(5).fill(0);
    let attr_v: { [attr: string]: number } = {};
    let ret = 0;
    for (let card of band) {
        if (!card) continue;
        let bp = card_bp(card);
        band_v[((card.characterId-1) / 5) | 0] += bp;
        if (!attr_v[card.attr]) attr_v[card.attr] = 0;
        attr_v[card.attr] += bp;
        ret += bp;
    }
    ret += Math.max(0, ...band_v) * BAND_MULT;
    ret += Math.max(0, ...Object.values(attr_v)) * ATTR_MULT;
    return ret | 0;
}

async function card_init() {
    let responses = await Promise.all([
        fetch("https://api.bandori.ga/v1/jp/card"),
        fetch("https://api.bandori.ga/v1/en/card"),
    ]);
    let [jp_cards, en_cards]: Card[][] = (await Promise.all([
        responses[0].json(),
        responses[1].json()
    ])).map(x => x.data);
    jp_cards.sort((lhs, rhs) => rhs.rarity - lhs.rarity || lhs.cardId - rhs.cardId);
    for (let card of jp_cards) {
        if (card.releasedAt > Date.now()) continue;
        card.attr = card.attr[0].toUpperCase() + card.attr.slice(1);
        card_data.set(card.cardId, card);
    }
    for (let card of en_cards) {
        let jp_card = card_data.get(card.cardId);
        if (!jp_card) continue;
        jp_card.titleEn = card.title;
        card_data.set(card.cardId, jp_card);
    }
    let card_sels: HTMLSelectElement[] = [];
    for (let i = 1; i <= names.length; i++)
        card_sels[i] = <HTMLSelectElement>document.getElementById(`card-picker-${i}`);

    for (let [card_id, card] of card_data) {
        let option = document.createElement("option");
        option.value = `${card_id}`;
        option.text = card_str(card);
        card_sels[card.characterId].add(option);
    }

    let modal = $("#select-card-modal");
    let opener: HTMLButtonElement;
    document.querySelectorAll(".card-btn").forEach(element => 
        element.addEventListener("click", event => { 
            opener = <HTMLButtonElement>element;
            modal.modal("show");
        })
    );
    document.querySelectorAll(".card-del").forEach(element =>
        element.addEventListener("click", event => {
            let card_btn = <HTMLButtonElement>element.previousElementSibling;
            card_btn.value = "-1";
            card_btn.textContent = "Select card...";
        })
    );
    for (let i = 1; i <= names.length; i++) {
        card_sels[i].addEventListener("change", event => {
            if (card_sels[i].value == "-1") return;
            let card = card_data.get(parseInt(card_sels[i].value));
            if (!card) return;
            opener.value = card.cardId.toString();
            opener.textContent = card_str(card);
            card_sels[i].value = "-1";

            let opener_id = opener.id.substr(-1);
            let skill_sel = <HTMLSelectElement>document.getElementById(`skill${opener_id}`);
            skill_sel.value = SKILL_MAP[card.skill.skillId];
            skill_sel.dispatchEvent(new Event("change"));

            modal.modal("hide");
        });
    }

    for (let i = 0; i < 5; i++) {
        let card_button = <HTMLButtonElement>document.getElementById(`card${i}`);
        card_button.disabled = false;
    }
}