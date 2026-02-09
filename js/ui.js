const circle = document.getElementById("circle");

let dragging = false;

circle.addEventListener("pointerdown", e => {
  if (!e.target.classList.contains("letter")) return;
  dragging = true;
  game.clearSelection();
  game.addLetter(e.target.dataset.letter, e.target);
});

circle.addEventListener("pointermove", e => {
  if (!dragging) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el && el.classList.contains("letter") && !el.classList.contains("active")) {
    game.addLetter(el.dataset.letter, el);
  }
});

window.addEventListener("pointerup", () => {
  dragging = false;
});

document.getElementById("check").addEventListener("click", () => game.check());
document.getElementById("clear").addEventListener("click", () => game.clearSelection());
document.getElementById("hint").addEventListener("click", () => game.hint());

document.getElementById("restart").addEventListener("click", () => {
  game.level = 1;
  game.score = 0;
  game.start();
  document.getElementById("win").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
});
