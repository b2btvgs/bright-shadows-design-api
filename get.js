import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'artWorkId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      artWorkId: event.pathParameters.id
    }
  };

  try {
    console.log("params is: " + JSON.stringify(params));
    const result = await dynamoDbLib.call("get", params);
    console.log("result is: " + JSON.stringify(result));
    if (result.Item) {
      // Return the retrieved item
      console.log("just before returning success");
      return success(result.Item);
    } else {
      console.log(
        "no result object - just before returning failure item not found"
      );
      return failure({ status: false, error: "Item not found." });
    }
  } catch (e) {
    console.log("catch: " + "error is: " + JSON.stringify(e));
    return failure({ status: false });
  }
}
