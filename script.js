// elements
const selectBreed = document.getElementById("breed");
const imgCount = document.getElementById("img-count");
const imagesConatiner = document.getElementById("images-container");
const breedType = document.getElementById("type");
const options = document.getElementById("options");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const squareOne = document.getElementById("square-1");
const squareTwo = document.getElementById("square-2");

let displayNum = +imgCount.value;
let cur_index = +squareOne.textContent;
let end_index = 10;
let images = null;

async function getAllBreeds(url = "https://dog.ceo/api/breeds/list/all") {
  const res = await fetch(url);
  const data = await res.json();

  const breeds = Object.keys(data.message);
  return breeds;
}

function setTotalPics(pics) {
  end_index = pics;
  squareOne.textContent = cur_index;
  squareTwo.textContent = end_index;
}

async function getImagesByBreed(
  breed,
  url = `https://dog.ceo/api/breed/${breed}/images`
) {
  const res = await fetch(url);
  const img = await res.json();
  return img.message;
}

function clearImages() {
  imagesConatiner.innerHTML = "";
}

function resetStartIndex() {
  cur_index = 0;
}

function updateDisplay() {
  clearImages();
  let i = cur_index;
  while (i < cur_index + displayNum) {
    const img = document.createElement("img");
    img.src = images[i];
    imagesConatiner.appendChild(img);
    i++;
  }
}

async function displayImages() {
  console.log(cur_index);
  console.log(typeof cur_index);

  if (displayNum > 10)
    return `displayNum must be <= 10\ndisplayNum: ${displayNum}`;
  if (!images) return;

  if (!Array.isArray(images)) return;

  if (images.length < displayNum) {
    displayNum = images.length;
  }

  console.log(cur_index);
  console.log(typeof cur_index);
  console.log(images);
  updateDisplay();
  console.log(cur_index);
  console.log(typeof cur_index);
  console.log(images);
}

async function selectRandomImages(
  numImages,
  url = `https://dog.ceo/api/breeds/image/random/${numImages}`
) {
  if (numImages > 50) return `numImages must be <=50\nnumImgaes = ${numImages}`;
  const res = await fetch(url);
  images = await res.json();
  return images;
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

async function setBreedType(breed) {
  if (!breed) return;
  breedType.innerHTML = "Breed: " + breed[0].toUpperCase() + breed.slice(1);
}

function handlePrev() {
  cur_index -= displayNum;
  if (cur_index < 1) cur_index = 1;
}

function handleNext() {
  if (cur_index + displayNum > end_index) cur_index = end_index - displayNum;
  else cur_index += displayNum;
}

function handleChangeImgCount(event) {
  displayNum = +event.target.value;
  if (images) {
    (async () => {
      console.log("about to display images");
      await displayImages();
    })();
  }
}

async function handleSelectBreed(event) {
  resetStartIndex();
  const breed = event.target.value;
  await setBreedType(breed);
  images = await getImagesByBreed(breed);
  setTotalPics(images.length);
  await displayImages();
}

//event listeners
imgCount.addEventListener("change", (event) => {
  handleChangeImgCount(event);
});

selectBreed.addEventListener("change", (event) => {
  handleSelectBreed(event);
});

next.addEventListener("click", handleNext);

function main() {
  addBreedsToSelect();
}

main();
