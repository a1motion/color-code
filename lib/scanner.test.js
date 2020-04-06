const test = require("ava");
const scanner = require("./scanner");

test("allows char only", (t) => {
  t.deepEqual(scanner("T"), [
    {
      type: "CHAR",
      value: "T".charCodeAt(0),
    },
  ]);
});

test("allows chars only", (t) => {
  t.deepEqual(scanner("Test"), [
    {
      type: "CHAR",
      value: "T".charCodeAt(0),
    },
    {
      type: "CHAR",
      value: "e".charCodeAt(0),
    },
    {
      type: "CHAR",
      value: "s".charCodeAt(0),
    },
    {
      type: "CHAR",
      value: "t".charCodeAt(0),
    },
  ]);
});

test("returns a char when control is not complete", (t) => {
  t.deepEqual(scanner("\x1b"), [
    {
      type: "CHAR",
      value: 27,
    },
  ]);
});

test("returns a control value", (t) => {
  t.deepEqual(scanner("\x1b["), [
    {
      type: "CONTROL",
      value: {
        intermediates: [],
        parameters: [],
      },
    },
  ]);
});

test("returns a control value with parameters", (t) => {
  t.deepEqual(scanner("\x1b[1m"), [
    {
      type: "CONTROL",
      value: {
        intermediates: [],
        parameters: [49],
      },
    },
  ]);
});

test("returns a control value with intermediates", (t) => {
  t.deepEqual(scanner("\x1b[!m"), [
    {
      type: "CONTROL",
      value: {
        intermediates: [33],
        parameters: [],
      },
    },
  ]);
});
