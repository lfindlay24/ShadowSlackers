import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('AccountTable')

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
    # Example: Get item by primary key
    key = event['queryStringParameters']['id']  # Assuming 'id' is the primary key
    response = table.get_item(Key={'id': key})
    item = response.get('Item', {})

    return {
        "statusCode": 200,
        "body": json.dumps(item),
    }

def post(event, context):
    # Example: Add a new item
    body = event['body']
    if isinstance(body, str):
        item = json.loads(body)
    else:
        item = body
    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item added successfully",
            "item": item
        }),
    }

def put(event, context):
    # Example: Update an existing item
    item = json.loads(event['body'])
    key = {'id': item['id']}  # Assuming 'id' is the primary key
    update_expression = "set info = :info"  # Example update expression
    expression_attribute_values = {':info': item['info']}  # Example attribute values

    table.update_item(
        Key=key,
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item updated successfully",
            "item": item
        }),
    }

def delete(event, context):
    # Example: Delete an item by primary key
    key = event['queryStringParameters']['id']  # Assuming 'id' is the primary key
    table.delete_item(Key={'id': key})

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Item deleted successfully"
        }),
    }
