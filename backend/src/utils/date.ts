import utc from "dayjs/plugin/utc.js"
import timezone from "dayjs/plugin/timezone.js"
import dayjs from "dayjs"

dayjs.extend(utc)
dayjs.extend(timezone)

const IST = "Asia/Kolkata"

/* ---------- CURRENT IST TIME ---------- */

export const getISTNow = () => {
  return dayjs().tz(IST).toDate()
}

/* ---------- IST DATE STRING (YYYY-MM-DD) ---------- */

export const getISTDate = () => {
  return dayjs().tz(IST).format("YYYY-MM-DD")
}

/* ---------- START OF DAY IST ---------- */

export const getISTStartOfDay = () => {
  return dayjs().tz(IST).startOf("day").toDate()
}

/* ---------- END OF DAY IST ---------- */

export const getISTEndOfDay = () => {
  return dayjs().tz(IST).endOf("day").toDate()
}

/* ---------- FORMAT DATE TO IST STRING ---------- */

export const formatISTDate = (date) => {
  return dayjs(date).tz(IST).format("YYYY-MM-DD")
}

/* ---------- CONVERT INPUT DATE TO DB DATE ---------- */

export const toISTDate = (date) => {
  return dayjs(date).tz(IST).startOf("day").toDate()
}