module.exports = (tokens) => {
  const ast = [];
  let current = 0;
  const isAtEnd = () => {
    return current >= tokens.length;
  };

  const advance = () => {
    current++;
    return tokens[current - 1];
  };

  const peak = () => {
    if (isAtEnd()) {
      return 0;
    }

    return tokens[current];
  };

  while (!isAtEnd()) {
    const c = advance();
    if (c.type === "CHAR") {
      const str = [c.value];
      while (peak().type === "CHAR") {
        str.push(advance().value);
      }

      ast.push({ type: "STRING", value: Buffer.from(str).toString() });
    } else if (c.type === "CONTROL") {
      const { value } = c;
      const parameters = Buffer.from(value.parameters).toString().split(";");
      const intermediates = Buffer.from(value.intermediates);
      ast.push({ type: "CONTROL", value: { parameters, intermediates } });
    }
  }

  return ast;
};
