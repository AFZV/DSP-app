export function formatValue(value: number) {
  if (!value) {
    return 0;
  }
  try {
    const formateado = value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
    return formateado;
  } catch (error) {
    console.log("error al formatear:", error);
  }
}
