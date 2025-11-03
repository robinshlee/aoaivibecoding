export interface Task {
  description: string
  startTime: string
  endTime: string
  isUserTask: boolean
  eisenhowerCategory: string
}

export interface ScheduleResponse {
  schedule: Task[]
}
