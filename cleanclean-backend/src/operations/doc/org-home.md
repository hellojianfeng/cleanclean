# org-home operation

> org-home operation is API to access org home page for user

## About

This API is use to access org-home operation. when click one org link, will navigate to org home page through this operation.

Basic format to access this operation(API) is same as all other operation:

  ```
    method: http(s) post
    url: http(s)://..../run-operation/
  ```

Post data specially for this operation(for different operation, post data is different):

  ```
    {
      "operation":"org-home",
      "data":{
        "org_id":"5bee766acc4a3b48773ce5e2"
      }
    }
  ```
please note that in data section, can also use org object which has a _id property as below:

  ```
    {
      "operation":"org-home",
      "data":{
        "org":{
          "_id":"5bee766acc4a3b48773ce5e2",
          .....
        }
      }
    }
  ```

Each operation include some stages, the format to specify stage in operation is like below

  ```
    {
      "operation":"org-home",
      "stage":"start",
      .....
    }
  ```

org-home operation include below stages:
1. start stage (default): this stage is default stage, in this stage, this operation return user's operations within this org, return data show like below:

    ```
      {
          "page": {
              "oid": "5bee7f8d994c7149b04a82af"
          },
          "stage": "start",
          "data": {
              "operations": {
                  "org-initialize": {
                      "_id": "5bee7f8d994c7149b04a82ae",
                      "app": "default",
                      "name": "org-initialize",
                      "org": "5bee7f8d994c7149b04a82ad",
                      "path": "org-initialize",
                      "stages": [],
                      "createdAt": "2018-11-16T08:27:57.668Z",
                      "updatedAt": "2018-11-16T08:27:57.668Z",
                      "__v": 0
                  }
              },
              ....
          }
      }
    ```

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure use is authenticated before access this API
2. use POST method to access http(s)://xxxx/run-operation and type POST body like below

    ```
    {
      "operation":"org-home",
      "stage": "start",
      "data":{
        "org":{
          "_id":"5bee766acc4a3b48773ce5e2",
          .....
        }
      }
    }
    ```
3. find response data like below:

    ```
      {
        "page": {
            "oid": "5bee7705cc4a3b48773ce5ee"
        },
        "stage": "start",
        "data": {
            "operations": {
                "org-initialize": {
                    "_id": "5bee766acc4a3b48773ce5e3",
                    "app": "default",
                    "name": "org-initialize",
                    "org": "5bee766acc4a3b48773ce5e2",
                    "path": "org-initialize",
                    "stages": [],
                    "createdAt": "2018-11-16T07:48:58.785Z",
                    "updatedAt": "2018-11-16T07:48:58.785Z",
                    "__v": 0
                },
                ....
            }
        }
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
