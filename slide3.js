const buttons = document.querySelectorAll(".btn");
const sliders = document.querySelectorAll(".slider");
const dot_imgs = document.querySelectorAll(".dot_img");
const dot = document.querySelector(".dot_imgs");

let currentIndex = 2;
let lastIndex = sliders.length;
let direction = 1; //right
const newlist = [];
let preNode;

dot_imgs.forEach((node) => {
  newlist.push(node);
});
console.log(buttons);
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    direction = btn.dataset.id === "preBtn" ? -1 : 1;
    currentIndex += direction;
    if (currentIndex >= lastIndex) {
      currentIndex = 0;
    } else if (currentIndex < 0) {
      currentIndex = lastIndex - 1;
    }
    console.log(direction);
    if (direction == 1) {
      //點擊後第一筆可以加到最後面
      preNode = newlist.shift();
      newlist.push(preNode);
    } else {
      preNode = newlist.pop();
      newlist.unshift(preNode);
    }
    console.log(newlist);
    newlist.forEach((node) => {
      dot.appendChild(node);
    });
    reflash();
  });
});

dot_imgs.forEach((dot_img) => {
  dot_img.addEventListener("click", () => {
    currentIndex = dot_img.dataset.id;

    reflash();
  });
});

function reflash() {
  sliders.forEach((slide) => {
    slide.style.display = slide.dataset.id == currentIndex ? "block" : "none";
  });
  dot_imgs.forEach((dot_img) => {
    dot_img.style.opacity = currentIndex == dot_img.dataset.id ? "1" : " 0.5";
  });
}
reflash();
