/* eslint-disable no-control-regex */
const escape = require(`escape-html`);
const scanner = require(`./lib/scanner`);
const parser = require(`./lib/parser`);
const BASIC_COLORS = require(`./basic.json`);

const fontColor = (color, options) =>
  options.noHtml ? `` : `<span style="color:rgb(${color});">`;
const backgroundColor = (color, options) =>
  options.noHtml ? `` : `<span style="background-color:rgb(${color});">`;

const checkRGBValue = (value) => {
  return (
    value &&
    !Number.isNaN(Number.parseInt(value, 10)) &&
    Number(value) >= 0 &&
    Number(value) < 256
  );
};

const getColorFromParams = (params) => {
  const [type, r, g, b] = params;
  if (type === `5` && checkRGBValue(r)) {
    const id = Number(r);
    if (id < 8) {
      return BASIC_COLORS[id + 30];
    }

    if (id < 16) {
      return BASIC_COLORS[id + 90 - 8];
    }
  } else if (type === `2`) {
    if (checkRGBValue(r) && checkRGBValue(g) && checkRGBValue(b)) {
      return `${r},${g},${b}`;
    }
  }

  return undefined;
};

const defaultOptions = {
  noHtml: false,
};

const colorCode = (str, opts) => {
  const options = Object.assign({}, defaultOptions, opts);
  let tokens = scanner(str);
  tokens = parser(tokens);
  let s = ``;
  let RESETABLE = 0;
  let HAS_CHANGED_COLOR = false;
  let HAS_CHANGED_BACKGROUND = false;
  let LAST_COLOR_USED = null;
  const reset = (repeat = 1) => {
    if (!options.noHtml) {
      s += `</span>`.repeat(repeat);
    }
  };

  const setColor = (color) => {
    RESETABLE++;
    if (HAS_CHANGED_COLOR) {
      RESETABLE--;
      reset();
    }

    LAST_COLOR_USED = [`fg`, color];
    HAS_CHANGED_COLOR = true;
    s += fontColor(color, options);
  };

  const setBackground = (color) => {
    RESETABLE++;
    if (HAS_CHANGED_BACKGROUND) {
      RESETABLE--;
      reset();
    }

    LAST_COLOR_USED = [`bg`, color];
    HAS_CHANGED_BACKGROUND = true;
    s += backgroundColor(color, options);
  };

  for (const token of tokens) {
    if (token.type === `STRING`) {
      s += options.noHtml ? token.value : escape(token.value);
    } else if (token.type === `CONTROL`) {
      const { parameters } = token.value;
      if (/^(3[0-7])$/.test(parameters[0])) {
        let [, color] = /^(3[0-7])$/.exec(parameters[0]);
        color = Number(color);
        if (parameters[1] === `1`) {
          color += 60;
        }

        setColor(BASIC_COLORS[color]);
      } else if (/^(4[0-7])$/.test(parameters[0])) {
        let [, color] = /^(4[0-7])$/.exec(parameters[0]);
        color = Number(color) - 10;
        if (parameters[1] === `1`) {
          color += 60;
        }

        setBackground(BASIC_COLORS[color]);
      } else if (parameters[0] === `38`) {
        const color = getColorFromParams(parameters.slice(1));
        if (color) {
          setColor(color);
        }
      } else if (parameters[0] === `39`) {
        if (HAS_CHANGED_COLOR) {
          reset();
          if (LAST_COLOR_USED[0] && LAST_COLOR_USED[0] === `bg`) {
            RESETABLE--;
            setBackground(LAST_COLOR_USED[1]);
          }
        }

        HAS_CHANGED_COLOR = false;
      } else if (parameters[0] === `48`) {
        const color = getColorFromParams(parameters.slice(1));
        if (color) {
          setBackground(color);
        }
      } else if (parameters[0] === `49`) {
        if (HAS_CHANGED_BACKGROUND) {
          reset();
        }

        if (LAST_COLOR_USED[0] && LAST_COLOR_USED[0] === `fg`) {
          RESETABLE--;
          setColor(LAST_COLOR_USED[1]);
        }

        HAS_CHANGED_BACKGROUND = false;
      } else if (parameters[0] === `0` || parameters.length === 0) {
        HAS_CHANGED_BACKGROUND = false;
        HAS_CHANGED_COLOR = false;
        reset(RESETABLE);
        RESETABLE = 0;
      }
    }
  }

  reset(RESETABLE);
  return s;
};

Object.defineProperty(exports, `__esModule`, {
  value: true,
});

module.exports = colorCode;

exports.default = colorCode;
