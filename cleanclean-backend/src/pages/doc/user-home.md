# org-home operation

> user-home page is an API to access user home page

## About

This API is use to access user-home page. when click user home link, will navigate to user home page. this page is also enter page after login.

Basic format to access page(API) is as below:

  ```
    method: http(s) post
    url: http(s)://..../pages/
  ```

Post body for different page is different, user-home post body like below:

  ```
    {
      "page":"user-home"
    }
  ```

Each page include some actions, the format to specify action in page is like below

  ```
    {
      "page":"user-home",
      "action":"open",
      .....
    }
  ```

user-home page include below actions:
1. open action (default): this action is default action, in this action, this page return user object with all user's orgs, meanwhile it will remove current org for user, return data show like below:

    ```
    {
        "page": "user-home",
        "action": "open",
        "data": {
            "user": {
                "_id": "5bee4812bc2f7546dcbad6b1",
                "email": "user1@example.com",
                "password": "$2a$13$q8m3tWNUxReMoL5/twaD3ukw5P42cILaju/bZnAymAcUoz2DG21qe",
                "roles": [
                    {
                        "_id": "5bee48f5bc2f7546dcbad6bb",
                        "oid": "5bee48f5bc2f7546dcbad6b9",
                        "path": "admin",
                        "org": {
                            "oid": "5bee48f5bc2f7546dcbad6b3",
                            "path": "company01"
                        }
                    },
                    .....
                ],
                "permissions": [],
                "operations": [],
                "createdAt": "2018-11-16T04:31:14.443Z",
                "updatedAt": "2018-11-17T02:14:28.525Z",
                "__v": 0,
                "current_org": null
            },
            "orgs": [
                {
                    "_id": "5bee4910bc2f7546dcbad6ca",
                    "name": "system department",
                    "path": "company01#system",
                    "profiles": [],
                    "createdAt": "2018-11-16T04:35:28.856Z",
                    "updatedAt": "2018-11-16T04:35:28.856Z",
                    "__v": 0
                },
                ....
            ]
        }
    }
    ```

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure use is authenticated before access this API
2. use POST method to access http(s)://xxxx/pages and type POST body like below
  
  ```
    {
      "page":"user-home"
    }
  ```
3. find response data like below:

    ```
    {
        "page": "user-home",
        "action": "open",
        "data": {
            "user": {
                "_id": "5bee4812bc2f7546dcbad6b1",
                "email": "user1@example.com",
                "password": "$2a$13$q8m3tWNUxReMoL5/twaD3ukw5P42cILaju/bZnAymAcUoz2DG21qe",
                "roles": [
                    {
                        "_id": "5bee48f5bc2f7546dcbad6bb",
                        "oid": "5bee48f5bc2f7546dcbad6b9",
                        "path": "admin",
                        "org": {
                            "oid": "5bee48f5bc2f7546dcbad6b3",
                            "path": "company01"
                        }
                    },
                    .....
                ],
                "permissions": [],
                "operations": [],
                "createdAt": "2018-11-16T04:31:14.443Z",
                "updatedAt": "2018-11-17T02:14:28.525Z",
                "__v": 0,
                "current_org": null
            },
            "orgs": [
                {
                    "_id": "5bee4910bc2f7546dcbad6ca",
                    "name": "system department",
                    "path": "company01#system",
                    "profiles": [],
                    "createdAt": "2018-11-16T04:35:28.856Z",
                    "updatedAt": "2018-11-16T04:35:28.856Z",
                    "__v": 0
                },
                ....
            ]
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
