"use strict";

const images = {};
//let scene = 0;
let scene = 2;
let x = 350;
let y = 350;
const customers = [];
let betweenCustomers = false;
let hand = null;
let voids = [];
let moods = [];

async function setup() {
    createCanvas(800, 600);
    const imageNames = ["title", "bigface", "bigglow", "tutorial", "ending", "background", "crate", "slab", "void", "basin"];
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

function keyReleased() {
    if (scene == 2)
        if (key == 'e')
            if (hand == null && x <= 150 && y >= 250 && y <= 475)
                hand = "basin";
            else if (x >= 550 && y >= 250 && y <= 475) {
                let v = -1;
                if (y >= 250 && y <= 350)
                    v = 0;
                else if (y > 350 && y <= 450)
                    v = 1;
                else
                    v = 2;
                if (hand != null) {
                    voids[v][1] = 0;
                    voids[v][2] = hand;
                    hand = null;
                } else {
                    hand = moods[Math.floor(Math.random()*3)];
                    voids[v][1] = -1;
                    voids[v][2] = null;
                }
            }
    return false;
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

    const dx = 5;
    const dy = dx;
    if (keyIsDown('w') && y >= 250)
        y -= dy;
    if (keyIsDown('a') && x >= 100)
        x -= dx;
    if (keyIsDown('s') && y <= 500)
        y += dy;
    if (keyIsDown('d') && x <= 600)
        x += dx;
    image(images["crate"], x, y, 100, 100);
    if (hand != null)
        image(images[hand], x+25, y-50, 50, 50);

    if (voids.length == 0)
        voids = [[300,-1,null], [375,-1,null], [450,-1,null]];
    for (const v of voids) {
        if (v[1] >= 0) {
            if (v[1] < 10)
                v[1] += 0.01;
            fill("white");
            rect(700, v[0], 100, 10);
            fill("green");
            rect(700, v[0], 10*v[1], 10);
        }
    }

    if (moods.length == 0)
        moods = ["crate", "slab", "void"];
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
