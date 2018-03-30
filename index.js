#!/usr/bin/env node
const fs = require("fs");
const { promisify } = require("util");

const cliFrames = require("cli-frames");
const colours = require("colors/safe");
const _ = require("lodash");

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const colourPool = [
  "blue",
  "cyan",
  "green",
  "magenta",
  "red",
  "white",
  "yellow"
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
  return readDirAsync(`${__dirname}/frames`).then(processFrames);
}

async function processFrames(data) {
  const frames = await data.map(getFrame);

  return await Promise.all(frames)
    .then(frames => frames.map(frame => frame.toString()))
    .then(coloriseArray);
}
function getFrame(frame) {
  return Promise.resolve(readFileAsync(`${__dirname}/frames/${frame}`));
}

function coloriseArray(pool) {
  return pool.map(_.unary(coloriseString));
}

function coloriseString(str) {
  return colours[_.sample(colourPool)](str);
}

process.on("unhandledRejection", _.unary(console.log));
