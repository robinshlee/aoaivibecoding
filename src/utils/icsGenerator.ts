import { Task } from '../types'

export const generateICS = (schedule: Task[]): string => {
  const now = new Date()
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const parseTime = (timeStr: string): Date => {
    const today = new Date()
    const [hours, minutes] = timeStr.split(':').map(Number)
    today.setHours(hours, minutes, 0, 0)
    return today
  }

  const formatICSDate = (timeStr: string): string => {
    const date = parseTime(timeStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }

  const escapeICSText = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
  }

  let icsContent = 'BEGIN:VCALENDAR\r\n'
  icsContent += 'VERSION:2.0\r\n'
  icsContent += 'PRODID:-//Daily Focus Planner//EN\r\n'
  icsContent += 'CALSCALE:GREGORIAN\r\n'
  icsContent += 'METHOD:PUBLISH\r\n'
  icsContent += 'X-WR-CALNAME:Daily Focus Schedule\r\n'
  icsContent += 'X-WR-TIMEZONE:UTC\r\n'

  schedule.forEach((item, index) => {
    const uid = `${timestamp}-${index}@dailyfocusplanner.com`
    const summary = escapeICSText(item.description)
    const description = item.isUserTask 
      ? `Eisenhower Category: ${item.eisenhowerCategory}\\nTask Type: User Task`
      : 'Task Type: Calendar Event'
    
    const startTime = formatICSDate(item.startTime)
    const endTime = formatICSDate(item.endTime)

    icsContent += 'BEGIN:VEVENT\r\n'
    icsContent += `UID:${uid}\r\n`
    icsContent += `DTSTAMP:${timestamp}\r\n`
    icsContent += `DTSTART:${startTime}\r\n`
    icsContent += `DTEND:${endTime}\r\n`
    icsContent += `SUMMARY:${summary}\r\n`
    icsContent += `DESCRIPTION:${description}\r\n`
    icsContent += 'STATUS:CONFIRMED\r\n'
    icsContent += 'SEQUENCE:0\r\n'
    icsContent += 'END:VEVENT\r\n'
  })

  icsContent += 'END:VCALENDAR\r\n'
  
  return icsContent
}
