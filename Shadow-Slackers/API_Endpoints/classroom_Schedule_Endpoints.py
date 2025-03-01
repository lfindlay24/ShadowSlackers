import json
import boto3
from boto3.dynamodb.conditions import Key
from classroomSchedule import classroomSchedule
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ClassroomTable')

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

json.JSONEncoder.default = DecimalEncoder().default

def lambda_handler(event, context):
    http_method = event.get("httpMethod")
    
    if http_method == "POST":
        if event.get('pathParameters') and 'roomNum' in event['pathParameters']:
            return addClassroom(event, context)
        else:
            return addClassToClassroom(event, context)
    elif http_method == "GET":
        return getAllClassrooms(event, context)
    else:
        return {
            "statusCode": 405,
            "body": json.dumps({
                "message": "Method Not Allowed"
            }),
        }
        
def addClassroom(event, context): 
    roomNum = event['pathParameters']['roomNum']
    
    if not roomNum:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "roomNum is required"
            }),
        }
    
    classroom = classroomSchedule(roomNum)
    
    table.put_item(Item=classroom.toJSON())
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Classroom added successfully"
        }),
    }
        
def addClassToClassroom(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body
    
    if 'roomNum' not in item or 'className' not in item or 'startTime' not in item or 'endTime' not in item or 'days' not in item:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "roomNum, className, startTime, endTime, and days are required"
            }),
        }
    
    roomNum = item['roomNum']
    
    response = table.get_item(Key={'roomNum': roomNum})
    
    if 'Item' not in response:
        return {
            "statusCode": 404,
            "body": json.dumps({
                "message": "Classroom not found"
            }),
        }
    
    classroom = classroomSchedule(roomNum)
    classroom.fromJSON(response['Item'])
    
    try:
        classroom.addClass(item['className'], item['startTime'], item['endTime'], item['days'])
    except ValueError as e:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": str(e)
            }),
        }
    
    table.put_item(Item=classroom.toJSON())

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Class added successfully"
        }),
    }

def getAllClassrooms(event, context):
    response = table.scan()
    classrooms = response['Items']
    return {
        "statusCode": 200,
        "body": json.dumps(classrooms, cls=DecimalEncoder),
    }

