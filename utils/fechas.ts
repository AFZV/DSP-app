import { startOfDay, endOfDay } from "date-fns";
import { format, utcToZonedTime } from "date-fns-tz";

const timeZone = "America/Bogota"; // o la que uses
const now = new Date();
const zonedNow = utcToZonedTime(now, timeZone);
const formateada = format(zonedNow, "yyyy-MM-dd HH:mm:ssXXX", {
  timeZone: "America/Bogota",
});

export const inicioDia = startOfDay(
  utcToZonedTime(new Date(), "America/Bogota")
);
export const finDia = endOfDay(utcToZonedTime(new Date(), "America/Bogota"));
