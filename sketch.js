const images = {};
let scene = 0;

async function setup() {
    createCanvas(800, 600);
    imageNames = ["title", "bigface", "bigglow", "tutorial", "ending"];
    for (let i = 0; i < imageNames.length; ++i)
        images[imageNames[i]] = await loadImage("/assets/" + imageNames[i] + ".png");
    noSmooth();
}

function mouseClicked() {
    if (scene == 0) {
        if (mouseX >= 225 && mouseX <= 550 && mouseY >= 250 && mouseY <= 550)
            scene = 1;
    } else if (scene == 1) {
        scene = 2;
    } else if (scene == 3) {
        if (mouseX >= 225 && mouseX <= 550 && mouseY >= 300 && mouseY <= 600)
            scene = 0;
    }
}

function title() {
    image(images["title"], 0, 0, 800, 600);
    if (mouseX >= 225 && mouseX <= 550 && mouseY >= 250 && mouseY <= 550)
        image(images["bigglow"], 200, 250, 400, 300);
    image(images["bigface"], 200, 250, 400, 300);
}

function tutorial() {
    image(images["tutorial"], 0, 0, 800, 600);
}

function level() {
    scene = 3
}

function ending() {
    image(images["ending"], 0, 0, 800, 600);
    if (mouseX >= 225 && mouseX <= 550 && mouseY >= 300 && mouseY <= 600)
        image(images["bigglow"], 200, 300, 400, 300);
    image(images["bigface"], 200, 300, 400, 300);
}

function draw() {
    switch (scene) {
        case 0:
            title();
            break;
        case 1:
            tutorial();
            break;
        case 2:
            level();
            break;
        case 3:
            ending();
    }
}
