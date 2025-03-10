import json
import boto3
from boto3.dynamodb.conditions import Key
from classroomSchedule import classroomSchedule
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ClassroomTable')

def getAvailableClass(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body

    if 'day' not in item or 'timeStart' not in item or 'timeEnd' not in item:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "day, timeStart, and timeEnd are required"
            }),
        }
    
    day = item['day']
    timeStart = item['timeStart']
    timeEnd = item['timeEnd']

    response = table.scan()
    classroomList = response['Items']

    classroomObjects = []
    for classroom in classroomList:
        classroomObj = classroomSchedule(classroom['roomNum'])
        classroomObj.fromJSON(classroom)
        classroomObjects.append(classroomObj)


    availableRooms = []

    for classroom in classroomObjects:
        if classroom.isAvailable(timeStart, timeEnd, day):
            availableRooms.append(classroom.roomNum)

    if len(availableRooms) == 0:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "No available rooms",
                "day": day,
                "startTime": timeStart,
                "endTime": timeEnd
            }),
        }
    else:
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "Available rooms found",
                "availableRooms": availableRooms,
                "day": day,
                "startTime": timeStart,
                "endTime": timeEnd
            }),
        }