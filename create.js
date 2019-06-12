import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    console.log("just before calling dynamodb put");
    console.log("params is: " + JSON.stringify(params));
    await dynamoDbLib.call("put", params);
    console.log("dynamodb put call now completed");
    return success(params.Item);
  } catch (e) {
    console.log("catch called");
    console.log("error message is: " + JSON.stringify(e));
    return failure({ status: false });
  }
}
