const wrapperEl = document.querySelector(".wrapper");
const carouselEl = document.querySelector(".carousel");
const firstCardWidth = carouselEl.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper .arrow-btn");
const carouselChildrens = [...carouselEl.children];

let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carouselEl.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carouselEl.insertAdjacentHTML("afterbegin", card.outerHTML);
    // carouselEl.insertAdjacentElement("afterbegin", card);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carouselEl.insertAdjacentHTML("beforeend", card.outerHTML);
    // carouselEl.insertAdjacentElement("beforeend", card);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carouselEl.classList.add("no-transition");
carouselEl.scrollLeft = carouselEl.offsetWidth;
carouselEl.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carouselEl.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
});

function dragStart(e) {
    isDragging = true;
    carouselEl.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carouselEl.scrollLeft;
}

function dragging(e) {
    if(!isDragging) return; // if isDragging is false return from here

    // Updates the scroll position of the carousel based on the cursor movement
    carouselEl.scrollLeft = startScrollLeft - (e.pageX - startX);
}

function dragStop() {
    isDragging = false;
    carouselEl.classList.remove("dragging");
}

function infiniteScroll() {
    // If the carousel is at the beginning, scroll to the end
    if(carouselEl.scrollLeft === 0) {
        carouselEl.classList.add("no-transition");
        carouselEl.scrollLeft = carouselEl.scrollWidth - (2 * carouselEl.offsetWidth);
        carouselEl.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carouselEl.scrollLeft) === carouselEl.scrollWidth - carouselEl.offsetWidth) {
        carouselEl.classList.add("no-transition");
        carouselEl.scrollLeft = carouselEl.offsetWidth;
        carouselEl.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapperEl.matches(":hover")) autoPlay();
}

function autoPlay() {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false

    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carouselEl.scrollLeft += firstCardWidth, 2_500);
}
autoPlay();

carouselEl.addEventListener("mousedown", dragStart);
carouselEl.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carouselEl.addEventListener("scroll", infiniteScroll);
wrapperEl.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapperEl.addEventListener("mouseleave", autoPlay);
