function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}


let typed = new Typed('#element', {
  strings: ['Mobile App Developer', 'Frontend Developer', 'UI/UX Designer', 'Backend Developer','C++','java', 'Pythan', 'FullStack web Developer'],
  typeSpeed: 30,
});





const beeModel = document.getElementById("bee-model");
const sections = Array.from(document.querySelectorAll("section"));

const shiftPositions = [0, -20, 0, 25,];
const cameraOrbits = [[90,90], [-45, 90],[-180, 0], [-45, 90], [45,90], [90,90],[-180, 0],[170, 30],[20, 30],[80, 0],[90, 90]];

const sectionOffsets = sections.map(section => section.offsetTop);
const lastSectionIndex = sections.length - 1;

const interpolate = (start, end, progress) => start + (end - start) + progress;

const getScrollProgramess = scrollY => {
    for(let i=0; i < lastSectionIndex; i++){
        if(scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i + 1]) {
            return i + (scrollY - sectionOffsets[i]) / (sectionOffsets[i + 1] - sectionOffsets[i]);
        }
    }
    return lastSectionIndex;
};

window.addEventListener("scroll", () => {
    const ScrollProgress = getScrollProgramess(window.scrollY);
    const sectionIndex = Math.floor(ScrollProgress);
    const sectionProgress = ScrollProgress - sectionIndex   

    const currentshift = interpolate(
        shiftPositions[sectionIndex],
        shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex],
    );

    const currentOrbit = cameraOrbits[sectionIndex].map((Val, i) =>
        interpolate(Val, cameraOrbits[sectionIndex + 1]?.[i] ?? Val, sectionProgress)
    );

    beeModel.style.transform = `translateX(${currentshift}%)`;
    beeModel.setAttribute("camera-orbit", `${currentOrbit[0]}deg ${currentOrbit[1]}deg`);

});