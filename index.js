#!/usr/bin/env node
const fs = require("fs");
const { promisify } = require("util");

const cliFrames = require("cli-frames");
const colors = require("colors/safe");
const _ = require("lodash");

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const colorsOptions = [
  "red",
  "yellow",
  "green",
  "blue",
  "magenta",
  "cyan",
  "white"
];

letsParty();

module.exports = letsParty;

async function letsParty() {
  const frames = await getFrames();
  new cliFrames({
    frames,
    autostart: {
      delay: 80,
      repeat: true
    }
  });
}

async function getFrames() {
  return readDirAsync("./frames").then(processFrames);
}

async function processFrames(data) {
  const frames = await data.map(getFrame);
  return await Promise.all(frames).then(coloriseArray);
}
function getFrame(frame) {
  return Promise.resolve(readFileAsync(`./frames/${frame}`));
}

function coloriseArray(pool) {
  return pool.map(_.unary(coloriseString));
}

function coloriseString(str) {
  return colors[_.sample(colorsOptions)](str);
}
