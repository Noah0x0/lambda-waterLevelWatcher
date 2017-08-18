# lambda-waterLevelWatcher
lambda for watching water level &amp; logging it.

### Setup
Initializes some files.
```
$ yarn setup
```

## Develop
```
$ yarn install
```

### Run Locally
Testing third party library.
```
$ yarn start
```

### Deploy Cloud
Uploading to Cloud via aws-cli.
1. Fill the blank in `.env` file
1. Write AWS_ENVIRONMENT, AWS_ROLE_ARN, AWS_FUNCTION_NAME
    ```
    AWS_ENVIRONMENT=development or production
    AWS_ROLE_ARN=arn:aws:***************
    ```
1. Deploy
    ```
    $ yarn deploy
    ```
