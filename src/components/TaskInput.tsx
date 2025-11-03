import React, { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface TaskInputProps {
  onScheduleGenerated: (data: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const TaskInput: React.FC<TaskInputProps> = ({ onScheduleGenerated, isLoading, setIsLoading }) => {
  const [todoList, setTodoList] = useState('')
  const [eventList, setEventList] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!todoList.trim()) {
      setError('Please enter at least one task')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://robinburnxp01.app.n8n.cloud/webhook/tasker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todoList: todoList.trim(),
          eventList: eventList.trim() || null
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Received data:', data)
      
      // Handle nested output structure
      if (data.output && Array.isArray(data.output)) {
        onScheduleGenerated({ schedule: data.output })
      } else if (Array.isArray(data)) {
        onScheduleGenerated({ schedule: data })
      } else if (data.schedule) {
        onScheduleGenerated(data)
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate schedule. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* To-Do List Input */}
      <div className="bg-white neo-border neo-shadow-lg p-6 md:p-8">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl md:text-2xl font-bold uppercase">YOUR TO-DO LIST</span>
            <span className="bg-[#FF005C] text-white text-xs font-bold px-2 py-1 neo-border">REQUIRED</span>
          </div>
          <p className="text-sm font-semibold mb-4 text-gray-700">
            Enter one task per line. Format: <code className="bg-gray-100 px-2 py-1 neo-border text-xs">taskname [(duration)] [(priority)]</code>
          </p>
          <div className="bg-[#00F0FF] neo-border p-3 mb-4">
            <p className="text-xs font-bold uppercase mb-2">EXAMPLES:</p>
            <ul className="text-xs font-mono space-y-1">
              <li>• Write quarterly report</li>
              <li>• Write quarterly report (2h)</li>
              <li>• Write quarterly report (urgent)</li>
              <li>• Write quarterly report (2h) (urgent)</li>
              <li>• Call client about proposal (30m) (important)</li>
            </ul>
          </div>
          <textarea
            value={todoList}
            onChange={(e) => setTodoList(e.target.value)}
            placeholder="Write quarterly report (2h) (urgent)&#10;Call client about proposal (30m) (important)&#10;Review team feedback&#10;Update project documentation (1h)&#10;Prepare presentation (45m) (urgent)"
            className="w-full h-48 p-4 neo-border font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[#00F0FF] resize-none"
            disabled={isLoading}
          />
        </label>
      </div>

      {/* Event List Input */}
      <div className="bg-white neo-border neo-shadow-lg p-6 md:p-8">
        <label className="block mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl md:text-2xl font-bold uppercase">EXISTING CALENDAR EVENTS</span>
            <span className="bg-gray-400 text-white text-xs font-bold px-2 py-1 neo-border">OPTIONAL</span>
          </div>
          <p className="text-sm font-semibold mb-4 text-gray-700">
            Enter existing meetings/events. Format: <code className="bg-gray-100 px-2 py-1 neo-border text-xs">time-time eventname</code>
          </p>
          <div className="bg-gray-100 neo-border p-3 mb-4">
            <p className="text-xs font-bold uppercase mb-2">EXAMPLES:</p>
            <ul className="text-xs font-mono space-y-1">
              <li>• 9:00-10:00 Team standup</li>
              <li>• 14:00-15:00 Client presentation</li>
              <li>• 16:30-17:00 1-on-1 with manager</li>
            </ul>
          </div>
          <textarea
            value={eventList}
            onChange={(e) => setEventList(e.target.value)}
            placeholder="9:00-10:00 Team standup&#10;14:00-15:00 Client presentation&#10;16:30-17:00 1-on-1 with manager"
            className="w-full h-32 p-4 neo-border font-mono text-sm focus:outline-none focus:ring-4 focus:ring-[#00F0FF] resize-none"
            disabled={isLoading}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#FF005C] text-white neo-border neo-shadow p-4">
          <p className="font-bold uppercase">ERROR</p>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#FF005C] text-white font-bold py-4 px-8 neo-border neo-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            GENERATING SCHEDULE...
          </>
        ) : (
          <>
            <Send className="w-6 h-6" />
            GENERATE MY SCHEDULE
          </>
        )}
      </button>
    </form>
  )
}

export default TaskInput
