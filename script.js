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

const beeModel = document.getElementById("bee-model");
const sections = Array.from(document.querySelectorAll("section"));
//[0, -25, 0, 25, -20, 0];
// 6 values perfectly matched to the 6 sections in your HTML
const shiftPositions = [0, -25, 0, 25, -20, 0];
const cameraOrbits = [
  [-45, 90], // Profile (Section 1)
  [-45, 90], // About
  [-180, 0], // Services
  [45, 90], // Experience
  [-40, 90], // Projects
  [-45, 90], // Contact
];

const sectionOffsets = sections.map((section) => section.offsetTop);
const lastSectionIndex = sections.length - 1;

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
let targetShift = shiftPositions[0];
let currentShift = shiftPositions[0];

let targetOrbit = [...cameraOrbits[0]];
let currentOrbit = [...cameraOrbits[0]];

window.addEventListener("scroll", () => {
  const ScrollProgress = getScrollProgress(window.scrollY);
  const sectionIndex = Math.floor(ScrollProgress);
  const sectionProgress = ScrollProgress - sectionIndex;

  targetShift = interpolate(
    shiftPositions[sectionIndex],
    shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex],
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
const animateBee = () => {
  // Lerp (Linear Interpolation) for buttery smooth gliding
  currentShift += (targetShift - currentShift) * 0.05;
  currentOrbit[0] += (targetOrbit[0] - currentOrbit[0]) * 0.05;
  currentOrbit[1] += (targetOrbit[1] - currentOrbit[1]) * 0.05;

  beeModel.style.transform = `translateX(${currentShift}%)`;
  beeModel.setAttribute(
    "camera-orbit",
    `${currentOrbit[0]}deg ${currentOrbit[1]}deg`,
  );

  requestAnimationFrame(animateBee);
};

// Start the animation loop
animateBee();

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
