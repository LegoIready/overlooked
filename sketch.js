const images = {};
//let scene = 0;
let scene = 2;
let x = 350;
let y = 350;
const customers = [];
let betweenCustomers = false;

async function setup() {
    createCanvas(800, 600);
    imageNames = ["title", "bigface", "bigglow", "tutorial", "ending", "background", "crate", "slab", "void", "basin"];
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
    image(images["background"], 0, 0, 800, 600);
    const slab_locations = [
        [0,150], [0,225], [0,525], // left wall
        [700,150], [700,225], [700,525], // right wall
        [100,150], [200,150], [300,150], [400,150]//, [500,225], [600,225] // top wall
    ];
    const crate_locations = [
        [0,300], [0,375], [0,450], // left wall
    ]
    const void_locations = [
        [700,300], [700,375], [700,450] // right wall
    ]
    for (const location of slab_locations)
        image(images["slab"], location[0], location[1], 100, 100);
    for (const location of crate_locations)
        image(images["crate"], location[0], location[1], 100, 100);
    for (const location of void_locations)
        image(images["void"], location[0], location[1], 100, 100);
    image(images["basin"], 500, 150, 200, 100);

    const dx = 4
    const dy = dx;
    image(images["crate"], x, y, 100, 100);
    if (keyIsDown('w') && y >= 250)
        y -= dy;
    if (keyIsDown('a') && x >= 100)
        x -= dx;
    if (keyIsDown('s') && y <= 500)
        y += dy;
    if (keyIsDown('d') && x <= 600)
        x += dx;

    const moods = ["crate", "slab", "void"];
    if (customers.length == 0 || customers.length < 5 && customers[customers.length - 1][0] == 0) {
        betweenCustomers = true;
        customers.push([-100, 50, moods[Math.floor(Math.random()*3)]]);
    }
    for (const customer of customers) {
        if (betweenCustomers && (customer[0] += 5) == 550)
                betweenCustomers = false;
        image(images["crate"], customer[0], customer[1], 100, 100);
        image(images[customer[2]], customer[0]+25, customer[1]-50, 50, 50);
    }
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
