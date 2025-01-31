import { format, parseISO } from "date-fns"

export const formatDateTime = (date: string, time: string) => {
  const dateTime = parseISO(`${date}T${time}`)
  return format(dateTime, "MMM d, yyyy h:mm a")
}

