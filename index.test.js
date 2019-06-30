import test from "ava";
import colorCode from "./index";

test(`basic red color`, (t) => {
  t.is(
    colorCode(`\x1b[31mHelloWorld\x1b[0m`),
    `<span style="color:rgb(222,56,43);">HelloWorld</span>`
  );
});

test(`basic bright red color`, (t) => {
  t.is(
    colorCode(`\x1b[31;1mHelloWorld\x1b[0m`),
    `<span style="color:rgb(255,0,0);">HelloWorld</span>`
  );
});

test(`basic red background color`, (t) => {
  t.is(
    colorCode(`\x1b[41mHelloWorld\x1b[0m`),
    `<span style="background-color:rgb(222,56,43);">HelloWorld</span>`
  );
});

test(`basic bright red background color`, (t) => {
  t.is(
    colorCode(`\x1b[41;1mHelloWorld\x1b[0m`),
    `<span style="background-color:rgb(255,0,0);">HelloWorld</span>`
  );
});

test(`resets with nothing`, (t) => {
  t.is(
    colorCode(`\x1b[31mHelloWorld`),
    `<span style="color:rgb(222,56,43);">HelloWorld</span>`
  );
});

test(`resets with one`, (t) => {
  t.is(
    colorCode(`\u001b[40m A \u001b[41m B \u001b[42m C \u001b[43m D \u001b[0m`),
    `<span style="background-color:rgb(1,1,1);"> A </span><span style="background-color:rgb(222,56,43);"> B </span><span style="background-color:rgb(57,181,74);"> C </span><span style="background-color:rgb(255,199,6);"> D </span>`
  );
});

test(`only reset color`, (t) => {
  t.is(
    colorCode(`\u001b[31mA\u001b[41mB\u001b[39mRed`),
    `<span style="color:rgb(222,56,43);">A<span style="background-color:rgb(222,56,43);">B</span></span><span style="background-color:rgb(222,56,43);">Red</span>`
  );
});

test(`24-bit colors`, (t) => {
  t.is(
    colorCode(`\u001b[38;2;12;34;56mTest`),
    `<span style="color:rgb(12,34,56);">Test</span>`
  );
});
