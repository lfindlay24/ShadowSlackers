import json
import boto3
from boto3.dynamodb.conditions import Key
import re

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('AccountsTable')

def lambda_handler(event, context):

    http_method = event.get("httpMethod")

    if http_method == "POST":
        return login(event, context)
    else:
        return {
            "statusCode": 405,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "Method Not Allowed"
            }),
        }
    
def login(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body

    if 'email' not in item or 'password' not in item:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "Email and password are required"
            }),
        }
    
    key = {'email': item['email']}
    response = table.get_item(Key=key)
    if 'Item' not in response:
        return {
            "statusCode": 404,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "Item not found"
            }),
        } 

    if response['Item']['password'] != item['password']:
        return {
            "statusCode": 401,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            "body": json.dumps({
                "message": "Invalid password"
            }),
        }
    
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        "body": json.dumps({
            "message": "Login successful",
            "item": response['Item']
        }),
    }