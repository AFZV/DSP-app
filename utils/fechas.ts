import { startOfDay, endOfDay } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";

const timeZone = "America/Bogota"; // o la que uses
const now = new Date();
const zonedNow = toZonedTime(now, timeZone);
const formateada = format(zonedNow, "yyyy-MM-dd HH:mm:ssXXX", {
  timeZone: "America/Bogota",
});

export const inicioDia = startOfDay(toZonedTime(new Date(), "America/Bogota"));
export const finDia = endOfDay(toZonedTime(new Date(), "America/Bogota"));
