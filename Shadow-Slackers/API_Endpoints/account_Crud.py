import json
import boto3
from boto3.dynamodb.conditions import Key
import re

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('AccountsTable')

def lambda_handler(event, context):

    http_method = event.get("httpMethod")

    if http_method == "GET":
        return get(event, context)
    elif http_method == "POST":
        return post(event, context)
    elif http_method == "PUT":
        return put(event, context)
    elif http_method == "DELETE":
        return delete(event, context)
    else:
        return {
            "statusCode": 405,
            "body": json.dumps({
                "message": "Method Not Allowed"
            }),
        }

def get(event, context):
    key = event['queryStringParameters']['email']
    response = table.get_item(Key={'email': key})
    item = response.get('Item', {})

    return {
        "statusCode": 200,
        "body": json.dumps(item),
    }

def post(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body

    if 'email' not in item or 'password' not in item:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Email and password are required"
            }),
        }

    if not is_valid_email(item.get('email')):
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Invalid email"
            }),
        }
    
    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item added successfully",
            "item": item
        }),
    }

def put(event, context):
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body
    
    key = {'email': item['email']}
    update_expression = "set password = :password"
    expression_attribute_values = {':password': item['password']}

    response = table.get_item(Key=key)
    if 'Item' not in response:
        return {
            "statusCode": 404,
            "body": json.dumps({
                "message": "Can't update item. Item not found"
            }),
        }

    table.update_item(
        Key=key,
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Password updated successfully",
            "item": item
        }),
    }

def delete(event, context):
    key = event['queryStringParameters']['email']
    table.delete_item(Key={'email': key})

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item deleted successfully"
        }),
    }

def is_valid_email(email):
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)
