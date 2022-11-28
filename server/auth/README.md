POST: localhost:4001/auth/createuser
Add {key, secret} to request body
    Valid:
    {
        "id": string,
        "email": string,
        "message": "created"
    }

    API service down:
    {
        "errors": [
            {
                "message": "API service unavailable"
            }
        ]
    }

    All errors from the POST request localhost:4000/api/checkkey can be thrown

    Email and password not valid (can occur alone):
    {
        "errors": [
            {
                "message": "Email not valid",
                "field": "email"
            },
            {
                "message": "Password must be at least 4 characters",
                "field": "password"
            }
        ]
    }

    Phone number invalid (either "" or 10 digits valid):
    {
        "errors": [
            {
                "message": "Phone number must either be empty or 10 digits"
            }
        ]
    }

    Email exists in DB:
    {
        "errors": [
            {
                "message": "Email already exists"
            }
        ]
    }

POST: localhost:4001/auth/checkuser
Add {key, secret, email, password} to request body
    Valid:
    {
        "id": string,
        "email": string,
        "valid": true,
        "message": "valid"
    }

    API service down:
    {
        "errors": [
            {
                "message": "API service unavailable"
            }
        ]
    }

    All errors from the POST request localhost:4000/api/checkkey can be thrown

    Email and password not valid (can occur alone):
    {
        "errors": [
            {
                "message": "Email not valid",
                "field": "email"
            },
            {
                "message": "Password must be at least 4 characters",
                "field": "password"
            }
        ]
    }

    Email does not exist:
    {
        "errors": [
            {
                "message": "Email not found"
            }
        ]
    }

    Wrong password:
    {
        "errors": [
            {
                "message": "Password incorrect"
            }
        ]
    }

POST: localhost:4001/auth/changepass
Add {key, secret, id, email, password} to request body
    Valid:
    {
        "id": string,
        "email": string,
        "message": "updated"
    }

    API service down:
    {
        "errors": [
            {
                "message": "API service unavailable"
            }
        ]
    }

    All errors from the POST request localhost:4000/api/checkkey can be thrown

    Email and password not valid (can occur alone):
    {
        "errors": [
            {
                "message": "Email not valid",
                "field": "email"
            },
            {
                "message": "Password must be at least 4 characters",
                "field": "password"
            },
            {
                "message": "Invalid value",
                "field": "id"
            }
        ]
    }

    Wrong ID or email:
    {
        "errors": [
            {
                "message": "ID and email do not correspond"
            }
        ]
    }

POST: localhost:4001/auth/forgotpass
Add {key, secret, email} to request body
    Valid:
    {
        "id": string,
        "email": string,
        "message": "updated and email sent"
    }
    Email also sent

    API service down:
    {
        "errors": [
            {
                "message": "API service unavailable"
            }
        ]
    }

    All errors from the POST request localhost:4000/api/checkkey can be thrown

    All errors from the POST request localhost:4001/auth/changepass can be thrown (highly unlikely)