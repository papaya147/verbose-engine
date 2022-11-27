GET: localhost:4000/api/createkey
    {
        key: string,
        secret: string
    }

GET: localhost:4000/api/checkkey
    Valid:
        Key and secret are valid

    Key or Secret not passed:
        {
            "errors": [
                {
                    "message": "Key or secret not passed"
                }
            ]
        }

    Wrong Key:
        {
            "errors": [
                {
                    "message": "Key does not exist"
                }
            ]
        }

    Key and Secret not associated:
        {
            "errors": [
                {
                    "message": "Key and secret do not correspond"
                }
            ]
        }