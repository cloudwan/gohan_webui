export default function uuidFormat(data) {
  const formats = [
    /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[1-5][A-Fa-f0-9]{3}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/,
    /^[A-Fa-f0-9]{8}[A-Fa-f0-9]{4}[1-5][A-Fa-f0-9]{3}[A-Fa-f0-9]{4}[A-Fa-f0-9]{12}$/,
  ];

  if (!data) {
    return true;
  }

  return formats.some(regexp => regexp.test(data));
}
