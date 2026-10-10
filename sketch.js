"use strict";

/*
Copyright 2026 Rose Enos

TODO:
- implement trashing
- implement setting down
- face assets
- people assets
- obtain face animation
- customer line spacing
*/

const images = {};
let scene = 2; // debugging
let x = 350;
let y = 350;
const customers = [];
let betweenCustomers = false;
let obtainingFace = false;
let waitingBasin = false;
let basinCounter = 0;
let backingUp = false;
let walkingAway = false;
let hand = null;
let voids = [];
let counters = [];
let moods = [];
let points = 0;
let timer = 0;

async function setup() {
    createCanvas(800, 600);
    const imageNames = ["title", "bigface", "bigglow", "tutorial", "ending", "background", "crate", "slab", "void", "basin"];
    for (let i = 0; i < imageNames.length; ++i)
        images[imageNames[i]] = await loadImage("/assets/" + imageNames[i] + ".png");
    noSmooth();
    textSize(48);
}

function mouseClicked() {
    if (scene == 0) {
        if (mouseX >= 225 && mouseX <= 550 && mouseY >= 250 && mouseY <= 550)
            scene = 1;
    } else if (scene == 1) {
        scene = 2;
    } else if (scene == 3) {
        if (mouseX >= 225 && mouseX <= 550 && mouseY >= 300 && mouseY <= 600) {
            points = 0;
            timer = -1;
            scene = 0;
        }
    }
}

function keyReleased() {
    if (scene == 2)
        if (key == 'e')
            if (hand == null && x <= 150 && y >= 250 && y <= 475)
                hand = "basin";
            else if (x >= 550 && y >= 275 && y <= 475) {
                let v = -1;
                if (y >= 275 && y <= 350)
                    v = 0;
                else if (y > 350 && y <= 450)
                    v = 1;
                else
                    v = 2;
                if (hand == "basin" && voids[v][2] == null) {
                    voids[v][1] = 0;
                    voids[v][2] = hand;
                    hand = null;
                } else if (hand == null && voids[v][1] >= 10) {
                    hand = moods[Math.floor(Math.random() * 3)];
                    voids[v][1] = -1;
                    voids[v][2] = null;
                }
            } else if (hand != null && x >= 475 && x <= 755 && y >= 245 && y <= 300) {
                if (hand == customers[0][2]) {
                    customers[0][2] = null;
                    customers[0][3] = "slab";
                    obtainingFace = true;
                } else if (hand != null && hand != customers[0][2])
                    points -= 20;
                hand = null;
            } else if (x < 475 && y <= 300) {
                let c = -1;
                if (x < 200)
                    c = 0;
                else if (x < 300)
                    c = 1;
                else if (x < 400)
                    c = 2;
                else
                    c = 3;
                if (hand != null && counters[c][1] == null) {
                    counters[c][1] = hand;
                    hand = null;
                } else if (hand == null && counters[c][1] != null) {
                    hand = counters[c][1];
                    counters[c][1] = null;
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
        [0, 150], [0, 225], [0, 525], // left wall
        [700, 150], [700, 225], [700, 525], // right wall
        [100, 150], [200, 150], [300, 150], [400, 150]//, [500,225], [600,225] // top wall
    ];
    const crate_locations = [
        [0, 300], [0, 375], [0, 450], // left wall
    ]
    const void_locations = [
        [700, 300], [700, 375], [700, 450] // right wall
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
    image(images["basin"], x, y, 100, 100);
    if (hand != null)
        image(images[hand], x + 25, y - 50, 50, 50);

    if (counters.length == 0)
        counters = [[100, null], [200, null], [300, null], [400, null]];
    for (const c of counters)
        if (c[1] != null)
            image(images[c[1]], c[0] + 25, 150 + 25, 50, 50);

    if (voids.length == 0)
        voids = [[300, -1, null], [375, -1, null], [450, -1, null]];
    for (const v of voids) {
        if (v[1] >= 0) {
            if (v[1] < 10)
                v[1] += 0.01;
            fill("white");
            rect(700, v[0], 100, 10);
            fill("green");
            rect(700, v[0], 10 * v[1], 10);
            fill("black");
        }
    }

    if (moods.length == 0)
        moods = ["crate", "slab", "void"];
    if (customers.length == 0 || customers.length < 7 && customers[customers.length - 1][0] == 0) {
        betweenCustomers = true;
        customers.push([-100, 50, moods[Math.floor(Math.random() * 3)], "crate"]);
    } else if (obtainingFace && (customers[0][1] += 1) == 100) {
        obtainingFace = false;
        waitingBasin = true;
    } else if (waitingBasin && (basinCounter += 1) == 100) {
        waitingBasin = false;
        basinCounter = 0;
        points += 100;
        backingUp = true;
    } else if (backingUp && (customers[0][1] -= 1) == 50) {
        backingUp = false;
        customers[0][3] = "basin";//"customer" + customers[0][2];
        walkingAway = true;
    } else if (walkingAway && (customers[0][0] += 5) == 800) {
        walkingAway = false;
        customers.splice(0, 1);
        betweenCustomers = true;
    }
    for (const customer of customers) {
        if (betweenCustomers && (customer[0] += 5) == 550)
            betweenCustomers = false;
        image(images[customer[3]], customer[0], customer[1], 100, 100);
        if (customer[2] != null)
            image(images[customer[2]], customer[0] + 25, customer[1] - 50, 50, 50);
    }

    text("Points: " + points, 0, 600);

    if (timer == -1)
        timer = 10000;
    timer -= 1;
    text("Time: " + timer, 550, 600);
    if (timer == 0)
        scene = 3;
}

function ending() {
    image(images["ending"], 0, 0, 800, 600);
    if (mouseX >= 225 && mouseX <= 550 && mouseY >= 300 && mouseY <= 600)
        image(images["bigglow"], 200, 300, 400, 300);
    image(images["bigface"], 200, 300, 400, 300);
    text("Points: " + points, 0, 600);
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
