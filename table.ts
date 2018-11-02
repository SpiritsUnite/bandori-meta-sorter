type Sort<T> = (x: T, y: T) => number;

interface TableCol {
    toNode: () => Node;
}

interface Object extends TableCol {}
Object.prototype.toNode = function() {
    return document.createTextNode(this.toString());
}

class TableURL implements TableCol {
    constructor(private text: string, private url: string) {}
    toNode() {
        let link = document.createElement("a");
        link.classList.add("text-dark");
        [link.textContent, link.href] = [this.text, this.url];
        return link;
    }
}

class Table<T extends TableCol[]> {
    data: T[] = [];
    constructor(private table: HTMLTableElement,
        private headers: { [E in keyof T]: string }
    ) {
        let t_head = table.createTHead();
        t_head.innerHTML = "";
        let head_row = t_head.insertRow();
        headers.forEach(element => {
            head_row.insertCell().textContent = element;
        });
        table.createTBody();
    }

    reset_body() {
        this.table.tBodies[0].innerHTML = "";
    }

    gen_body() {
        for (const data_row of this.data) {
            let row = this.table.insertRow();
            data_row.forEach(element => {
                row.insertCell().appendChild(element.toNode());
            });
        }
    }
}

let a = new Table<[string, number]>(new HTMLTableElement(), ["hello", "hello"]);


type Aoeu<T extends any[]> = T[number]

let b : Aoeu<[string, number]>