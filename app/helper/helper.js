export function flagToCountryCode(flagUnicode) {
  return [...flagUnicode]
    .map((char) => char.codePointAt(0) - 0x1f1e6 + 65)
    .map((code) => String.fromCharCode(code))
    .join("")
    .toLowerCase();
}

export function formatCurrency(number) {
  return new Intl.NumberFormat("us-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}
