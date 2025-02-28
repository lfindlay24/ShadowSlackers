class classroomSchedule: 
    def __init__(self, roomNum):
        self.roomNum = roomNum
        self.schedule = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": []
        }

    def addClass(self, className, startTime, endTime, days):
        for day in days.split(","):
            if day not in self.schedule:
                raise ValueError(f"Invalid day: {day}")
            if not self.isAvailable(startTime, endTime, day):
                raise ValueError(f"Class {className} conflicts with existing schedule")
            self.schedule[day].append((className, startTime, endTime))
            self.schedule[day].sort(key=lambda x: x[1])  # Sort by start time

    def isAvailable(self, startTime, endTime, day):
        for _, start, end in self.schedule[day]:
            if (startTime < end and start < endTime):
                return False
        return True
    
    def toJSON(self):
        return {
            "roomNum": self.roomNum,
            "schedule": self.schedule
        }
    
    def fromJSON(self, json_data):
        self.roomNum = json_data['roomNum']
        self.schedule = json_data['schedule']