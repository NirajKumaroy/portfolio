function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

let typed = new Typed("#element", {
  strings: [
    "Mobile App Developer",
    "Frontend Developer",
    "UI/UX Designer",
    "Backend Developer",
    "C++",
    "java",
    "Pythan",
    "FullStack web Developer",
  ],
  typeSpeed: 30,
});

const robotModel = document.getElementById("robot-model");
const sections = Array.from(document.querySelectorAll("section"));

// Desktop shifts (X and Y)
// X: 0 = Right side, -100 = Left side
// Y: 0 = Top, positive = move down (percent of viewport)
const shiftPositionsXDesktop = [0, -100, 0, -100, 0, -100, -50];
const shiftPositionsYDesktop = [0, 0, 0, 0, 0, 0, 0]; // Keep it vertically centered on desktop

// Mobile shifts (X and Y)
// X: 0 = Bottom-Right corner. Move negative to slide left.
// Y: 0 = Bottom-Right corner. Move negative to slide UP.
const shiftPositionsXMobile = [0, -100, 0, -100, 0, -100, -50];
const shiftPositionsYMobile = [0, -50, 0, -50, 0, -50, -25]; // Weave up and down while moving left/right

const cameraOrbits = [
  [-45, 90],  // Profile
  [45, 90],   // About (look right)
  [-180, 0],  // Services (top down)
  [45, 90],   // Experience (look right)
  [-45, 90],  // Certificate (look left)
  [45, 90],   // Projects (look right)
  [0, 90],    // Contact (centered)
];

let sectionOffsets = sections.map((section) => section.offsetTop);
const lastSectionIndex = sections.length - 1;

// Recalculate offsets on window resize for accurate scroll tracking
window.addEventListener("resize", () => {
  sectionOffsets = sections.map((section) => section.offsetTop);
});

/* Fixed interpolation math: multiply by progress, don't add it */
const interpolate = (start, end, progress) => start + (end - start) * progress;

const getScrollProgress = (scrollY) => {
  for (let i = 0; i < lastSectionIndex; i++) {
    if (scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i + 1]) {
      return (
        i +
        (scrollY - sectionOffsets[i]) /
          (sectionOffsets[i + 1] - sectionOffsets[i])
      );
    }
  }
  return lastSectionIndex;
};

// Advanced Physics: Store target vs current positions for Lerping
let targetShiftX = 0;
let currentShiftX = 0;

let targetShiftY = 0;
let currentShiftY = 0;

let targetOrbit = [...cameraOrbits[0]];
let currentOrbit = [...cameraOrbits[0]];

window.addEventListener("scroll", () => {
  const ScrollProgress = getScrollProgress(window.scrollY);
  const sectionIndex = Math.floor(ScrollProgress);
  const sectionProgress = ScrollProgress - sectionIndex;
  
  const isMobile = window.innerWidth <= 768;
  const shiftPositionsX = isMobile ? shiftPositionsXMobile : shiftPositionsXDesktop;
  const shiftPositionsY = isMobile ? shiftPositionsYMobile : shiftPositionsYDesktop;

  targetShiftX = interpolate(
    shiftPositionsX[sectionIndex],
    shiftPositionsX[sectionIndex + 1] ?? shiftPositionsX[sectionIndex],
    sectionProgress,
  );
  
  targetShiftY = interpolate(
    shiftPositionsY[sectionIndex],
    shiftPositionsY[sectionIndex + 1] ?? shiftPositionsY[sectionIndex],
    sectionProgress,
  );

  targetOrbit = cameraOrbits[sectionIndex].map((Val, i) =>
    interpolate(
      Val,
      cameraOrbits[sectionIndex + 1]?.[i] ?? Val,
      sectionProgress,
    ),
  );
});

// Smooth Animation Loop
const animateRobot = () => {
  // Lerp (Linear Interpolation) for buttery smooth gliding
  currentShiftX += (targetShiftX - currentShiftX) * 0.05;
  currentShiftY += (targetShiftY - currentShiftY) * 0.05;
  currentOrbit[0] += (targetOrbit[0] - currentOrbit[0]) * 0.05;
  currentOrbit[1] += (targetOrbit[1] - currentOrbit[1]) * 0.05;

  if (robotModel) {
    robotModel.style.transform = `translate(${currentShiftX}%, ${currentShiftY}%)`;
    robotModel.setAttribute(
      "camera-orbit",
      `${currentOrbit[0]}deg ${currentOrbit[1]}deg`,
    );
  }

  requestAnimationFrame(animateRobot);
};

// Start the animation loop
animateRobot();

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleDesktop = document.getElementById(
    "theme-toggle-icon-desktop",
  );
  const themeToggleMobile = document.getElementById("theme-toggle-icon-mobile");
  const body = document.body;
  const moonIconClass = "fa-moon";
  const sunIconClass = "fa-sun";

  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      if (themeToggleDesktop)
        themeToggleDesktop.classList.replace(moonIconClass, sunIconClass);
      if (themeToggleMobile)
        themeToggleMobile.classList.replace(moonIconClass, sunIconClass);
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      if (themeToggleDesktop)
        themeToggleDesktop.classList.replace(sunIconClass, moonIconClass);
      if (themeToggleMobile)
        themeToggleMobile.classList.replace(sunIconClass, moonIconClass);
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    if (body.classList.contains("dark-mode")) {
      applyTheme("light");
    } else {
      applyTheme("dark");
    }
  };

  if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener("click", toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener("click", () => {
      toggleTheme();
      toggleMenu(); // Also close the hamburger menu
    });
  }

  // Apply saved theme on initial load
  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme || "light");
});

// VIDEO MODAL LOGIC
const videoModal = document.getElementById("video-modal");
const modalVideo = document.getElementById("modal-video");
const closeModalBtn = document.querySelector(".close-modal");

window.openVideoModal = function (videoSrc) {
  modalVideo.src = videoSrc;
  videoModal.style.display = "flex";
};

const closeVideoModal = () => {
  videoModal.style.display = "none";
  modalVideo.pause();
  modalVideo.src = ""; // Clear source to stop downloading
};

closeModalBtn.addEventListener("click", closeVideoModal);

window.addEventListener("click", (event) => {
  if (event.target === videoModal) {
    closeVideoModal();
  }
});
