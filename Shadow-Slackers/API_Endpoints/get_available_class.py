import json
import boto3
from boto3.dynamodb.conditions import Key

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
            if not self.isAvailable(startTime, endTime):
                raise ValueError(f"Class {className} conflicts with existing schedule")
            self.schedule[day].append((className, startTime, endTime))
            self.schedule[day].sort(key=lambda x: x[1])  # Sort by start time

    def isAvailable(self, startTime, endTime, day):
        for _, start, end, days in self.schedule[day]:
            if (startTime <= end and start <= endTime):
                return False
        return True
    
def getAvailableClass(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body

    if 'day' not in item or 'timeStart' not in item or 'timeEnd' not in item:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "day, timeStart, and timeEnd are required"
            }),
        }
    
    day = item['day']
    timeStart = item['timeStart']
    timeEnd = item['timeEnd']

    # Create a classroom schedule using a fake for now until we can get the data from the database
    classroom = classroomSchedule(101)
    classroom2 = classroomSchedule(102)

    # Add some classes to the schedule (this would normally come from a database)
    classroom.addClass("Math", 9, 11, "Monday")
    classroom.addClass("Science", 11, 13, "Monday")
    classroom.addClass("History", 14, 16, "Monday")

    classroom2.addClass("Math", 8, 9, "Monday")
    classroom2.addClass("Science", 9, 10, "Monday")
    classroom2.addClass("History", 14, 16, "Monday")

    classroomList = [classroom, classroom2]

    availableRooms = []

    for classroom in classroomList:
        if classroom.isAvailable(timeStart, timeEnd):
            availableRooms.append(classroom.roomNum)

    if len(availableRooms) == 0:
        return {
            "statusCode": 404,
            "body": json.dumps({
                "message": "No available rooms",
                "day": day,
                "startTime": startTime,
                "endTime": endTime
            }),
        }
    else:
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Available rooms found",
                "availableRooms": availableRooms,
                "day": day,
                "startTime": startTime,
                "endTime": endTime
            }),
        }