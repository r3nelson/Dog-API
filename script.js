// HTML elements
const selectBreed = document.getElementById("breed");
const imgCount = document.getElementById("img-count");
const imagesContainer = document.getElementById("images-container");
const breedType = document.getElementById("type");
const options = document.getElementById("options");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const squareOne = document.getElementById("square-1");
const squareTwo = document.getElementById("square-2");
const random = document.getElementById("random");

//media queries
const smallScreen = window.matchMedia("(max-width: 800px)");
const longScreen = window.matchMedia(
  "(min-width: 800px) and (max-width: 2100px)"
);
const wideScreen = window.matchMedia("(min-width: 2101px)");

// global variables
let displayNum = +imgCount.value;
let cur_index = 0;
let end_index = 10;
let images = null;

// fetch requests
async function getAllBreeds(url = "https://dog.ceo/api/breeds/list/all") {
  const res = await fetch(url);
  const data = await res.json();

  const breeds = Object.keys(data.message);
  return breeds;
}
async function getImagesByBreed(
  breed,
  url = `https://dog.ceo/api/breed/${breed}/images`
) {
  const res = await fetch(url);
  const img = await res.json();
  return img.message;
}
async function selectRandomImages(numImages) {
  if (numImages > 50) return `numImages must be <=50\nnumImgaes = ${numImages}`;
  url = `https://dog.ceo/api/breeds/image/random/${numImages}`;
  const res = await fetch(url);
  images_object = await res.json();
  images = images_object.message;
  return images;
}

// updater functions
function setEndIndex(pics) {
  end_index = pics;
  updateSquareOne();
  squareTwo.textContent = end_index;
}
function clearImages() {
  imagesContainer.innerHTML = "";
}
function updateSquareOne() {
  squareOne.textContent = cur_index + 1;
}
function resetStartIndex() {
  cur_index = 0;
}
// media query matches (screen width <= 800px)
function adjustImagesForSmallScreen(e) {
  if (e.matches) {
    imagesContainer.style.display = "flex";
    imagesContainer.style.flexDirection = "column";
    imagesContainer.style.boxShadow = "none";
    imagesContainer.style.border = "none";
    imagesContainer.style.justifyContent = "center";
    imagesContainer.style.alignItems = "center";
  }
}
// media query matches (screen width >= 800px and <= 1600px)
function adjustImagesForLongScreen(e) {
  const visibleImages = document.querySelectorAll("img");
  const numVisibleImages = visibleImages.length;
  if (e.matches) {
    imagesContainer.style.display = "flex";
    imagesContainer.style.flexDirection = "column";
    // if > 5 images split into two columns
    if (numVisibleImages > 5) {
      imagesContainer.style.flexDirection = "row";
      const column1 = document.createElement("div");
      const column2 = document.createElement("div");
      column1.style.display = "flex";
      column1.style.flexDirection = "column";
      column2.style.display = "flex";
      column2.style.flexDirection = "column";
      imagesContainer.appendChild(column1);
      imagesContainer.appendChild(column2);

      for (let i = 0; i < numVisibleImages; i++) {
        if (i % 2 == 0) {
          column1.appendChild(visibleImages[i]);
        } else column2.appendChild(visibleImages[i]);
      }
    }
  }
}
// media query matches (screen width > 1600px)
function adjustImagesForWideScreen(e) {
  const visibleImages = document.querySelectorAll("img");
  const numVisibleImages = visibleImages.length;
  if (e.matches) {
    console.log(" it matched");
    imagesContainer.style.display = "flex";
    imagesContainer.style.flexDirection = "row";
    console.log(visibleImages);
    console.log(numVisibleImages);
    // if > 5 images split into two rows
    if (numVisibleImages > 5) {
      imagesContainer.style.flexDirection = "column";
      console.log("numVisibleImages", numVisibleImages);
      const row1 = document.createElement("div");
      const row2 = document.createElement("div");
      row1.style.display = "flex";
      row2.style.display = "flex";
      imagesContainer.appendChild(row1);
      imagesContainer.appendChild(row2);

      for (let i = 0; i < numVisibleImages; i++) {
        if (i % 2 == 0) {
          row1.appendChild(visibleImages[i]);
        } else row2.appendChild(visibleImages[i]);
      }
    }
  }
}
function handleMediaSize(e) {
  console.log("e from handleMediaSize", e);
  if (typeof e !== "number") return;

  if (e < 800) {
    console.log("small screen");
    adjustImagesForSmallScreen(smallScreen);
  } else if (e > 800 && e <= 2100) {
    console.log("long screen");
    adjustImagesForLongScreen(longScreen);
  } else if (e > 2100) {
    console.log("wide screen");
    adjustImagesForWideScreen(wideScreen);
  }
}
function resizeImages() {
  let visibleImages = document.querySelectorAll("img");
  const numVisibleImages = visibleImages.length;
  if (numVisibleImages === 0) return;

  const containerHeight = parseInt(getComputedStyle(imagesContainer).height);
  const containerWidth = parseInt(getComputedStyle(imagesContainer).width);

  if (!containerHeight || !containerWidth)
    return console.error(
      `error converting container height and width to int\n[containerHeight, containerWidth]:${
        (containerHeight, containerWidth)
      }`
    );

  const imgWidth = containerWidth / numVisibleImages;
  const imgHeight = containerHeight / numVisibleImages;
  visibleImages.forEach((img) => {
    img.style.width = String(imgWidth) + "px";
    img.style.height = String(imgHeight) + "px";
  });
}
function updateDisplay() {
  clearImages();
  let i = cur_index;
  while (i < cur_index + displayNum) {
    if (i >= end_index) break;
    const img = document.createElement("img");
    img.src = images[i];
    imagesContainer.appendChild(img);
    i++;
  }
  const screenSize = window.innerWidth;
  handleMediaSize(screenSize);
  //   resizeImages();
}
async function setBreedType(breed) {
  if (!breed) return;
  if (breed === "Random") breedType.textContent = "Random";
  else
    breedType.textContent = "Breed: " + breed[0].toUpperCase() + breed.slice(1);
}
async function displayImages() {
  //   console.log("from display images", displayNum, cur_index, end_index);
  if (displayNum > 10)
    return `displayNum must be <= 10\ndisplayNum: ${displayNum}`;
  if (!images) return;

  if (!Array.isArray(images)) return;

  if (images.length < displayNum) {
    displayNum = images.length;
  }
  updateDisplay();
}
async function addBreedsToSelect() {
  const breeds = await getAllBreeds();
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed;
    selectBreed.appendChild(option);
  });
}

// event handler functions
function handleNext() {
  if (cur_index + displayNum >= end_index) return;
  cur_index += displayNum;
  updateSquareOne();
  (async () => {
    await displayImages();
  })();
}
function handlePrev() {
  if (cur_index - displayNum <= 0) {
    cur_index = 0;
  } else cur_index -= displayNum;

  updateSquareOne();
  (async () => {
    await displayImages();
  })();
}
function handleChangeImgCount(event) {
  displayNum = +event.target.value;
  if (images) {
    (async () => {
      await displayImages();
    })();
  }
}
async function handleBreedChange() {
  setEndIndex(images.length);
  await displayImages();
}
async function handleRandom(numImages) {
  await setBreedType("Random");
  images = await selectRandomImages(numImages);
  if (images) {
    resetStartIndex();
    handleBreedChange();
  } else console.error("Error fetching random images");
}
async function handleSelectBreed(event) {
  resetStartIndex();
  const breed = event.target.value;
  await setBreedType(breed);
  images = await getImagesByBreed(breed);
  if (images) handleBreedChange();
  else console.error("No images to display");
}

//event listeners
random.addEventListener("click", () => handleRandom(50));
next.addEventListener("click", handleNext);
prev.addEventListener("click", handlePrev);
imgCount.addEventListener("change", (event) => {
  handleChangeImgCount(event);
});
selectBreed.addEventListener("change", (event) => {
  handleSelectBreed(event);
});

smallScreen.addEventListener("change", (e) =>
  handleMediaSize(window.innerWidth)
);
longScreen.addEventListener("change", (e) =>
  handleMediaSize(window.innerWidth)
);
wideScreen.addEventListener("change", (e) =>
  handleMediaSize(window.innerWidth)
);

function main() {
  addBreedsToSelect();
  handleRandom(1);
  //   const screenSize = window.innerWidth;
  //   handleMediaSize(screenSize);
}
main();
