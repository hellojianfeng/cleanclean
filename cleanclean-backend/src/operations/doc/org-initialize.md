# org-home operation

> org-initialize operation is API to access org-initialize page for user and do org initialize task.
## About

This API is use to access org-initialize operation. when click org-initialize link, will navigate to org initialize page through this operation and do initialize task.

Basic format to access this operation(API) is same as all other operation:

  ```
    method: http(s) post
    url: http(s)://..../run-operation/
  ```

Possible post body for this operation(for different operation, post body is different):
org input can be ignored, if ignore, use current_org (which is set when access org-home) 

  ```
    {
      "operation":"org-initialize",
      "org": "id or path",
      "action": "initialize",
      "data":{
        "operations":{....},
        "permissions":{....},
        "roles":{....}
      }
    }
  ```
full examples for company type of org like below: (please note that must use object stype to define operations, roles and permissions, these data will finally merged follow this format, if use array, it will not be merged correctly)

  ```
  {
		"operations":{
			"org-profile-management":{
				"name":"org-profile-management",
				"roles":["admin"]
			},
			"org-operation-management":{
				"name":"org-operation-management",
				"roles":["admin"]
			},
			"org-user-management":{
				"name":"org-user-management",
				"roles":["admin"]
			}
		},
		"permissions":{
			"employee":{
				"name":"employee",
				"description":"employee permission in org"
			},
			"customer":{
				"name":"customer",
				"description":"customer permission in org"
			},
			"public": {
				"name":"public",
				"description":"public permission in org"
			}
		},
		"roles": {
			"employee":{
				"name":"employee",
				"permissions":["employee"],
				"operations":[],
				"description":"employee role"
			},
			"customer":{
				"name":"customer",
				"permissions": ["customer"],
				"description":"customer role"
			},
			"public":{
				"name":"public",
				"permissions":["public"],
				"description":"public role in org"
			}
		},
		"orgs":{
			"department.system":{
				"name":"system department",
				"path":"system",
				"type":"company.department.system"
			}
		}
	}
  ```

Each operation include some actions, the format to specify stage in operation is like below

  ```
    {
      "operation":"org-initialize",
      "action":"open",
      .....
    }
  ```

org-initialize operation include below stages:
1. open action (default): this stage is default stage, in this stage, this operation return org initialize data according to org type and setting. 
org initialize data is caught from serveral source, these source include org type, org setting which is added when create org and operation data. for example, when create org, add an role in data (please see create-org page api for input during create org), and org type is company.clean which also define same role, and meanwhile we input operation.data with same role name (please refer above section for operation body), then final operation data will be merged one follow path of : operation data role >> override >> org data role (which is input when create org) >> override >> company.clean type role >> override >> company type same role (input from operation data folder for type).

Possible post body for this action:(action can be ignore for open, if not provide data, it also can get data recursively by above description).

  ```
    {
      "operation":"org-initialize",
      "action":"open",
      .....
    }
  ```
Possible response data like below:

    ```
      {
          "operations": {
              "org-profile-management": {
                  "name": "org-profile-management",
                  "roles": [
                      "admin"
                  ]
              },
              "org-operation-management": {
                  "name": "org-operation-management",
                  "roles": [
                      "admin"
                  ]
              },
              "org-user-management": {
                  "name": "org-user-management",
                  "roles": [
                      "admin"
                  ]
              }
          },
          "permissions": {
              "employee": {
                  "name": "employee",
                  "description": "employee permission in org"
              },
              "customer": {
                  "name": "customer",
                  "description": "customer permission in org"
              },
              "public": {
                  "name": "public",
                  "description": "public permission in org"
              }
          },
          "roles": {
              "employee": {
                  "name": "employee",
                  "permissions": [
                      "employee"
                  ],
                  "operations": [],
                  "description": "employee role"
              },
              "customer": {
                  "name": "customer",
                  "permissions": [
                      "customer"
                  ],
                  "description": "customer role"
              },
              "public": {
                  "name": "public",
                  "permissions": [
                      "public"
                  ],
                  "description": "public role in org"
              }
          },
          "orgs": {
              "department.system": {
                  "name": "system department",
                  "path": "system",
                  "type": "company.department.system"
              }
          }
      }
    ```
    
2. initialize action: this action finally run initialize action and will create roles, operations and so on for org.

Possible post body:
    ```
      {
        "operation":"org-initialize",
        "stage":"end"
      }
    ```
Possible response(this response prove initialize is completed and record is added into run-operation collection):

    ```
    {
        "progress": {
            "history": []
        },
        "_id": "5bef6bfd7514e04d3896baa6",
        "operation": {
            "oid": "5bef6ae97514e04d3896ba6e"
        },
        "user": {
            "oid": "5bee4812bc2f7546dcbad6b1"
        },
        "createdAt": "2018-11-17T01:16:45.510Z",
        "updatedAt": "2018-11-17T01:16:45.510Z",
        "__v": 0
    }
    ```

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure use is authenticated before access this API
2. use POST method to access http(s)://xxxx/run-operation and type POST body like below
    ```
      {
        "operation":"org-initialize",
        "org":"id or path",
        "action":"initialize",
        .....
      }
    ```
3. find response data like below:

    "open" action:
      ```
      {
          "operations": {
              "org-profile-management": {
                  "name": "org-profile-management",
                  "roles": [
                      "admin"
                  ]
              },
              "org-operation-management": {
                  "name": "org-operation-management",
                  "roles": [
                      "admin"
                  ]
              },
              "org-user-management": {
                  "name": "org-user-management",
                  "roles": [
                      "admin"
                  ]
              }
          },
          "permissions": {
              "employee": {
                  "name": "employee",
                  "description": "employee permission in org"
              },
              "customer": {
                  "name": "customer",
                  "description": "customer permission in org"
              },
              "public": {
                  "name": "public",
                  "description": "public permission in org"
              }
          },
          "roles": {
              "employee": {
                  "name": "employee",
                  "permissions": [
                      "employee"
                  ],
                  "operations": [],
                  "description": "employee role"
              },
              "customer": {
                  "name": "customer",
                  "permissions": [
                      "customer"
                  ],
                  "description": "customer role"
              },
              "public": {
                  "name": "public",
                  "permissions": [
                      "public"
                  ],
                  "description": "public role in org"
              }
          },
          "orgs": {
              "department.system": {
                  "name": "system department",
                  "path": "system",
                  "type": "company.department.system"
              }
          }
      }
    ```
  "initialize" action:
    
    ```
      {
        "page": {
            "oid": "5bee7705cc4a3b48773ce5ee"
        },
        "action": "initialize",
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
