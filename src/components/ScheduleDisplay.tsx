import React from 'react'
import { Download, RotateCcw, Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { ScheduleResponse } from '../types'
import { generateICS } from '../utils/icsGenerator'

interface ScheduleDisplayProps {
  schedule: ScheduleResponse
  onReset: () => void
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, onReset }) => {
  // Deduplicate schedule items based on description, startTime, and endTime
  const deduplicatedSchedule = React.useMemo(() => {
    const seen = new Set<string>()
    return schedule.schedule.filter(item => {
      const key = `${item.description}-${item.startTime}-${item.endTime}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }, [schedule.schedule])

  const getCategoryColor = (category: string, isUserTask: boolean) => {
    if (!isUserTask) {
      return 'bg-gray-100 border-gray-400'
    }
    
    const normalized = category.toLowerCase().trim()
    
    // Check for "Urgent & Important" or "Important & Urgent"
    if ((normalized.includes('urgent') && normalized.includes('important')) &&
        !normalized.includes('not urgent') && !normalized.includes('not important')) {
      return 'bg-[#FF005C] text-white'
    }
    
    // Check for "Not Urgent & Important" or "Important & Not Urgent"
    if (normalized.includes('not urgent') && normalized.includes('important') && !normalized.includes('not important')) {
      return 'bg-[#00F0FF] text-black'
    }
    
    // Check for "Urgent & Not Important" or "Not Important & Urgent"
    if (normalized.includes('urgent') && normalized.includes('not important') && !normalized.includes('not urgent')) {
      return 'bg-yellow-300 text-black'
    }
    
    // Check for "Not Urgent & Not Important" or "Not Important & Not Urgent"
    if (normalized.includes('not urgent') && normalized.includes('not important')) {
      return 'bg-white text-black border-black'
    }
    
    return 'bg-white text-black border-black'
  }

  const getCategoryLabel = (category: string) => {
    const normalized = category.toLowerCase().trim()
    
    // Check for "Urgent & Important" or "Important & Urgent"
    if ((normalized.includes('urgent') && normalized.includes('important')) &&
        !normalized.includes('not urgent') && !normalized.includes('not important')) {
      return 'DO FIRST'
    }
    
    // Check for "Not Urgent & Important" or "Important & Not Urgent"
    if (normalized.includes('not urgent') && normalized.includes('important') && !normalized.includes('not important')) {
      return 'SCHEDULE'
    }
    
    // Check for "Urgent & Not Important" or "Not Important & Urgent"
    if (normalized.includes('urgent') && normalized.includes('not important') && !normalized.includes('not urgent')) {
      return 'DELEGATE'
    }
    
    // Check for "Not Urgent & Not Important" or "Not Important & Not Urgent"
    if (normalized.includes('not urgent') && normalized.includes('not important')) {
      return 'ELIMINATE'
    }
    
    return 'N/A'
  }

  const parseTime = (timeStr: string): Date => {
    const today = new Date()
    const [hours, minutes] = timeStr.split(':').map(Number)
    today.setHours(hours, minutes, 0, 0)
    return today
  }

  const formatTime = (timeStr: string) => {
    const date = parseTime(timeStr)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    try {
      console.log('Download initiated')
      console.log('Schedule items:', deduplicatedSchedule.length)
      
      const icsContent = generateICS(deduplicatedSchedule)
      console.log('ICS content length:', icsContent.length)
      
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const link = e.currentTarget
      link.href = url
      link.download = `daily-focus-schedule-${new Date().toISOString().split('T')[0]}.ics`
      
      // Trigger download
      link.click()
      
      // Cleanup
      setTimeout(() => {
        URL.revokeObjectURL(url)
        console.log('Download cleanup completed')
      }, 100)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download calendar file. Please try again.')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const userTasks = deduplicatedSchedule.filter(item => item.isUserTask)
  const firstTime = deduplicatedSchedule.length > 0 ? deduplicatedSchedule[0].startTime : '09:00'
  const lastTime = deduplicatedSchedule.length > 0 ? deduplicatedSchedule[deduplicatedSchedule.length - 1].endTime : '17:00'

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="bg-[#00F0FF] neo-border neo-shadow p-4">
          <h2 className="text-2xl md:text-3xl font-bold uppercase">YOUR SCHEDULE</h2>
          <p className="font-semibold mt-1">
            {formatDate()}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="#"
            onClick={handleDownload}
            className="bg-[#FF005C] text-white font-bold py-3 px-6 neo-border neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center gap-2 no-underline"
          >
            <Download className="w-5 h-5" />
            DOWNLOAD ICS
          </a>
          <button
            onClick={handlePrint}
            className="bg-black text-white font-bold py-3 px-6 neo-border neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center gap-2 print:hidden"
            type="button"
          >
            <Calendar className="w-5 h-5" />
            PRINT
          </button>
          <button
            onClick={onReset}
            className="bg-white font-bold py-3 px-6 neo-border neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center gap-2 print:hidden"
            type="button"
          >
            <RotateCcw className="w-5 h-5" />
            NEW SCHEDULE
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white neo-border neo-shadow p-4">
          <p className="text-sm font-bold uppercase text-gray-600 mb-1">TOTAL ITEMS</p>
          <p className="text-3xl font-bold">{deduplicatedSchedule.length}</p>
        </div>
        <div className="bg-white neo-border neo-shadow p-4">
          <p className="text-sm font-bold uppercase text-gray-600 mb-1">YOUR TASKS</p>
          <p className="text-3xl font-bold">{userTasks.length}</p>
        </div>
        <div className="bg-white neo-border neo-shadow p-4">
          <p className="text-sm font-bold uppercase text-gray-600 mb-1">START TIME</p>
          <p className="text-3xl font-bold">{formatTime(firstTime)}</p>
        </div>
        <div className="bg-white neo-border neo-shadow p-4">
          <p className="text-sm font-bold uppercase text-gray-600 mb-1">END TIME</p>
          <p className="text-3xl font-bold">{formatTime(lastTime)}</p>
        </div>
      </div>

      {/* Schedule Timeline */}
      <div className="bg-white neo-border neo-shadow-lg p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-6 uppercase flex items-center gap-3">
          <Clock className="w-6 h-6" strokeWidth={3} />
          TIME BLOCKS
        </h3>

        <div className="space-y-4">
          {deduplicatedSchedule.map((item, index) => {
            const colorClass = getCategoryColor(item.eisenhowerCategory, item.isUserTask)
            const label = getCategoryLabel(item.eisenhowerCategory)
            
            return (
              <div
                key={`${item.description}-${item.startTime}-${index}`}
                className={`${colorClass} neo-border neo-shadow-sm p-4 md:p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${!item.isUserTask ? 'opacity-90' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-black text-white font-bold px-3 py-1 text-sm neo-border">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.isUserTask ? (
                            <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-gray-600" strokeWidth={3} />
                          )}
                          <h4 className="text-lg md:text-xl font-bold uppercase">
                            {item.description}
                          </h4>
                        </div>
                        {!item.isUserTask && (
                          <p className="text-sm font-bold text-gray-600 uppercase">
                            CALENDAR EVENT
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm font-bold ml-0 md:ml-14">
                      <span className="bg-white neo-border px-3 py-1 text-black">
                        {formatTime(item.startTime)} → {formatTime(item.endTime)}
                      </span>
                      {item.isUserTask && label !== 'N/A' && (
                        <span className="neo-border px-3 py-1 bg-black text-white">
                          {label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Eisenhower Matrix Legend */}
      <div className="bg-[#00F0FF] neo-border neo-shadow p-6">
        <h3 className="text-lg font-bold mb-4 uppercase">EISENHOWER MATRIX</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF005C] neo-border"></div>
            <div>
              <p className="font-bold uppercase">DO FIRST</p>
              <p className="text-sm font-semibold">Urgent & Important</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00F0FF] neo-border"></div>
            <div>
              <p className="font-bold uppercase">SCHEDULE</p>
              <p className="text-sm font-semibold">Important, Not Urgent</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-300 neo-border"></div>
            <div>
              <p className="font-bold uppercase">DELEGATE</p>
              <p className="text-sm font-semibold">Urgent, Not Important</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white neo-border"></div>
            <div>
              <p className="font-bold uppercase">ELIMINATE</p>
              <p className="text-sm font-semibold">Neither Urgent Nor Important</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t-2 border-black">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-gray-600" strokeWidth={3} />
            <p className="text-sm font-semibold">
              <span className="font-bold">CALENDAR EVENTS</span> are shown with gray styling and do not have Eisenhower categories
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleDisplay
