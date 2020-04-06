const finalByte = (byte) => {
  return byte >= 0x40 && byte <= 0x7e;
};

const scanner = (buf) => {
  buf = Buffer.from(buf);
  const tokens = [];
  let current = 0;
  const isAtEnd = () => {
    return current >= buf.length;
  };

  const advance = () => {
    current++;
    return buf[current - 1];
  };

  const peak = () => {
    if (isAtEnd()) {
      return 0;
    }

    return buf[current];
  };

  while (!isAtEnd()) {
    const c = advance();
    // ESC [
    if (c === 0x1b && peak() === 0x5b) {
      advance();
      const parameters = [];
      const intermediates = [];
      while (!finalByte(peak()) && !isAtEnd()) {
        const param = advance();
        if (param >= 0x30 && param <= 0x3f) {
          parameters.push(param);
        } else if (param >= 0x20 && param <= 0x2f) {
          intermediates.push(param);
        }
      }

      advance();
      tokens.push({ type: "CONTROL", value: { parameters, intermediates } });
    } else {
      tokens.push({ type: "CHAR", value: c });
    }
  }

  return tokens;
};

module.exports = scanner;
