# org-user-admin operation

> org-role-admin operation is API to manage org role

## About

### actions:

**open** : default ation, will return org_users, org_roles, org_operations by default.

**org-user-find** : use to find org users, can set limit, skip and so on.

**create-org-user** : use to create org user, if not provide role(s) for new user, will add everyong role to user.

**add-org-user** : use to add user to org, if not provide role(s) for user, will add everyone role to user. please note that user here should be an registered user.

**add-user-role** : use to add user role(s), if not provide role(s), will add everyone role to user.

## Input & output

### open action:

#### input
action can ignore and data can also ignor

  ```
{
	"operation":"org-user-admin",
  "action":"open",
	"data":{
	}
}
  ```

#### output
  ```
{
    "operation": {
        "_id": "5c25a0d814eb9e3244b20a94",
        "path": "org-user-admin"
    },
    "result": {
        "org_users": [
            {
                "_id": "5c25a0aa14eb9e3244b20a8e",
                "email": "user1@example.com",
                "password": "$2a$13$bmMKiiVX6hwPKrLMkwO1uOQ3gEcw5DQWzgcKdF/yuHqXsVGvSMcke",
                "roles": [
                    {
                        "_id": "5c25a0d814eb9e3244b20aa0",
                        "oid": "5c25a0d814eb9e3244b20a9d",
                        "path": "admin",
                        "org_id": "5c25a0d814eb9e3244b20a90",
                        "org_path": "company1"
                    }
                ],
                "permissions": [],
                "operations": [],
                "createdAt": "2018-12-28T04:03:54.276Z",
                "updatedAt": "2018-12-28T04:05:03.585Z",
                "__v": 0,
                "follow_org": null,
                "current_org": {
                    "oid": "5c25a0d814eb9e3244b20a90",
                    "path": "company1"
                }
            }, ...
        ],
        "org_permissions": [
            {
                "_id": "5c25a0d814eb9e3244b20a95",
                "name": "administrators",
                "org_id": "5c25a0d814eb9e3244b20a90",
                "org_path": "company1",
                "operations": [
                    {
                        "_id": "5c25a0d814eb9e3244b20a97",
                        "oid": "5c25a0d814eb9e3244b20a91",
                        "path": "org-initialize"
                    },
                    {
                        "_id": "5c25a0d814eb9e3244b20a96",
                        "oid": "5c25a0d814eb9e3244b20a94",
                        "path": "org-user-admin"
                    }
                ],
                "path": "administrators",
                "createdAt": "2018-12-28T04:04:40.833Z",
                "updatedAt": "2018-12-28T04:04:40.833Z",
                "__v": 0
            },...
        ],
        "org_roles": [
            {
                "_id": "5c25a0d814eb9e3244b20a9d",
                "name": "admin",
                "permissions": [
                    {
                        "include": {
                            "children": [],
                            "parent": []
                        },
                        "exclude": {
                            "children": [],
                            "parent": []
                        },
                        "_id": "5c25a0d814eb9e3244b20a9e",
                        "oid": "5c25a0d814eb9e3244b20a95",
                        "path": "administrators"
                    }
                ],
                "org_id": "5c25a0d814eb9e3244b20a90",
                "org_path": "company1",
                "path": "admin",
                "operations": [],
                "createdAt": "2018-12-28T04:04:40.904Z",
                "updatedAt": "2018-12-28T04:04:40.904Z",
                "__v": 0
            },...
        ],
        "org_operations": [
            {
                "_id": "5c25a0d814eb9e3244b20a91",
                "app": "default",
                "name": "org-initialize",
                "org_id": "5c25a0d814eb9e3244b20a90",
                "org_path": "company1",
                "path": "org-initialize",
                "stages": [],
                "createdAt": "2018-12-28T04:04:40.701Z",
                "updatedAt": "2018-12-28T04:04:40.701Z",
                "__v": 0
            },...
        ]
    }
}
  ```

### create-org-user action

#### input
**action**: required,
**email**: required,
**password**: optional, if not provide, will use password123 as default password
**role**: optional,
**roles**: optional, if not provide role and roles, will use everyone role as default role to user
```
{
	"operation":"org-user-admin",
	"action":"create-org-user",
	"data":{
		"email": "user11@example.com",
		"password":"12345",
		"role": "admin",
		"roles":["admin","everyone"]
	}
}
```
#### output

**if user exist**
```
{
    "operation": {
        "_id": "5c25a0d814eb9e3244b20a94",
        "path": "org-user-admin"
    },
    "result": {
        "error": 500,
        "message": "user exist already!"
    }
}
```

**if successfully**
```
{
    "operation": {
        "_id": "5c25a0d814eb9e3244b20a94",
        "path": "org-user-admin"
    },
    "result": {
        "user": {
            "_id": "5c26fa3ee6be1b3ac9593aa0",
            "email": "user11@example.com",
            "password": "$2a$13$2f/W6fsoE6vs.FRHGLXKEeX6w94mfHIZN7PGCVCGA1El2l5BBsv6.",
            "roles": [
                {
                    "_id": "5c26fa3ee6be1b3ac9593aa2",
                    "oid": "5c25a0d814eb9e3244b20a9f",
                    "path": "everyone",
                    "org_id": "5c25a0d814eb9e3244b20a90",
                    "org_path": "company1"
                },
                {
                    "_id": "5c26fa3ee6be1b3ac9593aa1",
                    "oid": "5c25a0d814eb9e3244b20a9d",
                    "path": "admin",
                    "org_id": "5c25a0d814eb9e3244b20a90",
                    "org_path": "company1"
                }
            ],
            "permissions": [],
            "operations": [],
            "createdAt": "2018-12-29T04:38:22.353Z",
            "updatedAt": "2018-12-29T04:38:22.361Z",
            "__v": 0
        }
    }
}
```

### add-org-user and add-user-role action
#### input
**action**: required,
**data.user**: required,
**data.role & data.roles**: optional, if not provide, will use everyone for user
```
{
	"operation":"org-user-admin",
	"action":"add-org-user",
	"data":{
		"user": "user12@example.com",
		"role": "admin",
		"roles":["admin"]
	}
}
```
#### output

**if user not exist**
```
{
    "operation": {
        "_id": "5c25a0d814eb9e3244b20a94",
        "path": "org-user-admin"
    },
    "result": {
        "error": 500,
        "message": "use is not exist!"
    }
}
```

**if successfully**
```
{
    "operation": {
        "_id": "5c25a0d814eb9e3244b20a94",
        "path": "org-user-admin"
    },
    "result": {
        "user": {
            "_id": "5c26fc4ee6be1b3ac9593aa3",
            "email": "user12@example.com",
            "password": "$2a$13$4u.SJzmh1XTY0x1Mx0cuLup7t3mqw1rLL5J8ebiV7kpzYhHOvMiC.",
            "roles": [
                {
                    "oid": "5c25a0d814eb9e3244b20a9d",
                    "path": "admin",
                    "org_id": "5c25a0d814eb9e3244b20a90",
                    "org_path": "company1"
                },
                {
                    "oid": "5c25a0d814eb9e3244b20a9f",
                    "path": "everyone",
                    "org_id": "5c25a0d814eb9e3244b20a90",
                    "org_path": "company1"
                }
            ],
            "permissions": [],
            "operations": [],
            "createdAt": "2018-12-29T04:47:10.827Z",
            "updatedAt": "2018-12-29T04:47:10.829Z",
            "__v": 0
        }
    }
}
```

### org-user-find action
#### input
**action**: required,
**data.limit**: optional, if not provide, use default 10
**data.skip**: optional, if not provide, use default 0
```
{
	"operation":"org-user-admin",
	"action":"org-user-find",
	"data":{
		"limit": 20,
		"skip": 1
	}
}
```
#### output
```
[
    {
        "_id": "5c25a5d2e0fd153741bd2830",
        "email": "user3@example.com",
        "password": "$2a$13$k27lRz8x3E6L0eY/iAZVW.Iuekp7/qW7HzxO97PYi0qrvlf7Un8hO",
        "roles": [
            {
                "_id": "5c25a5d6e0fd153741bd2831",
                "oid": "5c25a0d814eb9e3244b20a9f",
                "path": "everyone",
                "org_id": "5c25a0d814eb9e3244b20a90",
                "org_path": "company1"
            }
        ],
        "permissions": [],
        "operations": [],
        "createdAt": "2018-12-28T04:25:54.077Z",
        "updatedAt": "2018-12-28T04:25:58.048Z",
        "__v": 0
    },
    ....
]
```
## Testing

Simply test with post man tool

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
