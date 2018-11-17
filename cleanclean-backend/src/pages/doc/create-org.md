# org-home operation

> create-org page is an API to access create-org page and perform create org action.

## About

This API is use to access create-org page and then implement create org action. 

Basic format to access page(API) is as below:

  ```
    method: http(s) post
    url: http(s)://..../pages/
  ```

Post body for different page is different, create-org post body like below:

  ```
    {
      "page":"create-org",
      "action":"start",
      "data":{
        "name":"company101",
        "type":"company.clean"
      }
    }
  ```

Each page include some actions, the format to specify action in page is like below

  ```
    {
      "page":"create-org",
      "action":"start",
      .....
    }
  ```

create-org page include below actions:

1. start action (default): this action is default action, in this action, page return all types information, these types is useful for user to choose to create org:

Post body for "start" action:

  ```
    {
      "page":"create-org",
      "action":"start",
      "data":{
        "name":"company101"
      }
    }
  ```

Response data looks like:

  ```
    {
        "page": "create-org",
        "action": "start",
        "data": {
            "types": [
                {
                    "_id": "5bee48f5bc2f7546dcbad6b2",
                    "path": "company.clean",
                    "name": "clean",
                    "createdAt": "2018-11-16T04:35:01.648Z",
                    "updatedAt": "2018-11-16T04:35:01.648Z",
                    "__v": 0
                }
            ]
        }
    }
  ```
2. before-create-summary action: this action return summary report for creating org before really create org.

Post body for "before-create-summary" action:

  ```
    {
      "page":"create-org",
      "action":"before-create-summary",
      "data":{
        "name":"company101"
      }
    }
  ```
if not provide type, response will report error message like below:

  ```
    {
        "name": "GeneralError",
        "message": "org type is required!",
        "code": 500,
        "className": "general-error",
        "data": {},
        "errors": {}
    }
  ```
if post body is create with correct name and correct type path like below:

  ```
    {
      "page":"create-org",
      "action":"before-create-summary",
      "data":{
        "name":"company101",
        "type":"company.clean"
      }
    }
  ```
correct response for before-create-summary: 

  ```
    {
      "page":"create-org",
      "action":"before-create-summary",
      "data":{
        "name":"company101",
        "type":"company.clean"
      }
    }
  ```
3. create action: this action really create org.

Post body for create action: 

  ```
    {
      "page":"create-org",
      "action":"create",
      "data":{
        "name":"company101",
        "type":"company.clean"
      }
    }
  ```
response after successfully create org:

  ```
    {
        "_id": "5befca0c30b7b44ed80f623e",
        "action": "create",
        "data": {
            "create_result": {
                "_id": "5befca0c30b7b44ed80f6228",
                "name": "company101",
                "type": {
                    "oid": "5bee48f5bc2f7546dcbad6b2"
                },
                "path": "company101",
                "profiles": [],
                "createdAt": "2018-11-17T07:58:04.177Z",
                "updatedAt": "2018-11-17T07:58:04.177Z",
                "__v": 0
            }
        },
        "name": "create-org",
        "createdAt": "2018-11-17T07:58:04.223Z",
        "updatedAt": "2018-11-17T07:58:04.223Z",
        "__v": 0
    }
  ```

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure use is authenticated before access this API
2. use POST method to access http(s)://xxxx/pages and type POST body like below (action can change accordingly)
  
   ```
    {
      "page":"create-org",
      "action":"start",
      "data":{
        "name":"company101"
      }
    }
  ```
3. find response data like below(response result change accordingly to different action)

  ```
    {
        "_id": "5befca0c30b7b44ed80f623e",
        "action": "create",
        "data": {
            "create_result": {
                "_id": "5befca0c30b7b44ed80f6228",
                "name": "company101",
                "type": {
                    "oid": "5bee48f5bc2f7546dcbad6b2"
                },
                "path": "company101",
                "profiles": [],
                "createdAt": "2018-11-17T07:58:04.177Z",
                "updatedAt": "2018-11-17T07:58:04.177Z",
                "__v": 0
            }
        },
        "name": "create-org",
        "createdAt": "2018-11-17T07:58:04.223Z",
        "updatedAt": "2018-11-17T07:58:04.223Z",
        "__v": 0
    }
  ```

## Testing

Simply test with post man tool

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
