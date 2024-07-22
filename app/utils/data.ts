function formatNumberEUA(numero: number, max = 2): string {
  return numero.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: max,
  });
}

function getMinifiedAddress(address: string | null): string {
  if (address) {
    return (
      address.slice(0, 5) +
      "...." +
      address.slice(address.length - 4, address.length)
    );
  } else {
    return "none";
  }
}

export {formatNumberEUA, getMinifiedAddress};
