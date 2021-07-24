import { State } from "./state";

class TodoList extends HTMLElement {
  static style = `
    <style>
      ol { padding: 0; margin: 1em 0; }
      li { list-style: numeric inside; padding: 0.5em; margin: 0; }
      li:hover, li:focus-within { background-color: #eee; }
      button { width: 4em; float: right; }
    </style>
    `;

  static template = `<li>$1 <button type="button" value="$2">done</button></li>`;

  constructor() {
    super();
    this.state = new State(["todoList"], this.render.bind(this));
  }

  render(name, value) {
    this[name] = value;
    let list = "";
    this.todoList.map((v, i) => {
      list += TodoList.template.replace("$1", v).replace("$2", i);
    });

    this.shadowRoot.innerHTML = `${TodoList.style} <ol>${list}</ol>`;
  }

  async connectedCallback() {
    this.shadow = this.attachShadow({ mode: "closed" });
    this.render("todoList", (await this.state.get("todoList")) || []);

    this.shadow.addEventListener("click", async (e) => {
      if (e.target.nodeName !== "BUTTON") return;
      this.todoList.splice(e.target.value, 1);
      await this.state.set("todoList", this.todoList);
    });
  }
}

customElements.define("todo-list", TodoList);
