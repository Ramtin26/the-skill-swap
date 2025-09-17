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

export function getCleanFilename(url) {
  const path = url.split("?")[0]; // remove query string
  return path.split("/").pop(); // get last segment
}

export function capitalize(str) {
  if (!str) return ""; // handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function buildImageName(title, country, file) {
  const ext = file.name.split(".").pop();
  const jobTitle = title.replaceAll(" ", "-");
  return `${jobTitle}-${country}.${ext}`;
}
