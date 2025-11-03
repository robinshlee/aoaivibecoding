import React, { useState } from 'react'
import { Calendar, Clock, Download, Zap } from 'lucide-react'
import TaskInput from './components/TaskInput'
import ScheduleDisplay from './components/ScheduleDisplay'
import { ScheduleResponse } from './types'

function App() {
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleScheduleGenerated = (data: ScheduleResponse) => {
    setSchedule(data)
  }

  const handleReset = () => {
    setSchedule(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FF005C] neo-border-thick border-b-4 border-black p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#00F0FF] neo-border p-2">
              <Zap className="w-6 h-6 md:w-8 md:h-8" fill="#000000" stroke="#000000" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-tight">
              DAILY FOCUS PLANNER
            </h1>
          </div>
          <p className="text-white text-sm md:text-base font-semibold uppercase">
            EISENHOWER MATRIX × TIME BLOCKING
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {!schedule ? (
          <>
            {/* Hero Section */}
            <div className="mb-8 md:mb-12">
              <div className="bg-[#00F0FF] neo-border neo-shadow-lg p-6 md:p-8 mb-6">
                <h2 className="text-xl md:text-3xl font-bold mb-4 uppercase">
                  TRANSFORM CHAOS INTO CLARITY
                </h2>
                <p className="text-base md:text-lg font-semibold mb-4">
                  Paste your to-do list. Get a prioritized, time-blocked schedule. 
                  Download as ICS. Simple.
                </p>
                <div className="flex flex-wrap gap-4 text-sm md:text-base font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF005C] neo-border"></div>
                    <span>PRIORITIZE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF005C] neo-border"></div>
                    <span>TIME BLOCK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF005C] neo-border"></div>
                    <span>EXECUTE</span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white neo-border neo-shadow p-4">
                  <Calendar className="w-8 h-8 mb-3" stroke="#000000" strokeWidth={3} />
                  <h3 className="font-bold text-lg mb-2 uppercase">SMART SCHEDULING</h3>
                  <p className="text-sm font-semibold">Eisenhower Matrix logic detects conflicts & estimates time</p>
                </div>
                <div className="bg-white neo-border neo-shadow p-4">
                  <Clock className="w-8 h-8 mb-3" stroke="#000000" strokeWidth={3} />
                  <h3 className="font-bold text-lg mb-2 uppercase">TIME BLOCKING</h3>
                  <p className="text-sm font-semibold">Visual schedule with start/end times for each task</p>
                </div>
                <div className="bg-white neo-border neo-shadow p-4">
                  <Download className="w-8 h-8 mb-3" stroke="#000000" strokeWidth={3} />
                  <h3 className="font-bold text-lg mb-2 uppercase">EXPORT READY</h3>
                  <p className="text-sm font-semibold">Download as ICS file for Google Calendar sync</p>
                </div>
              </div>
            </div>

            {/* Task Input Form */}
            <TaskInput 
              onScheduleGenerated={handleScheduleGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </>
        ) : (
          <ScheduleDisplay 
            schedule={schedule} 
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-6 mt-12 neo-border-thick border-t-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-bold uppercase text-sm">
            BUILT WITH CHATANDBUILD × POWERED BY N8N AUTOMATION
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
