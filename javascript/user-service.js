// Initialize AWS Cognito
var cognito_region = 'us-west-2'
var cognito_user_pool_id = 'us-west-2_Er7fZiWGf'
var cognito_user_pool_app_client_id = '7b57ejilk6v49oot20cck0cap2'
var cognito_identity_pool_id = 'us-west-2:79ea3a8c-1c05-4345-88d5-f121c822d351'
var cognito_login_key = 'cognito-idp.' + cognito_region + '.amazonaws.com/' + cognito_user_pool_id
// Initialize the Amazon Cognito credentials provider
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cognito_identity_pool_id,
});
AWS.config.region = cognito_region;
var poolData = { 
    UserPoolId : cognito_user_pool_id,
    ClientId : cognito_user_pool_app_client_id
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

function loginUser(user_email, user_password) 
{   
    var authenticationData = {
        Username : user_email,
        Password : user_password,
    };

    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var userData = {
        Username : user_email,
        Pool : userPool
    };

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : cognito_identity_pool_id,
                Logins : {
                    cognito_login_key : result.getIdToken().getJwtToken()
                }
            });

            window.location.href = "index.html";

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        },
        onFailure: function(err) {
            alert(err);
        },

    });
}

function registerUser(user_email, user_password)
{
    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : user_email
    };

    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    userPool.signUp(user_email, user_password, 
        attributeList, null, function(err, result)
    {
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}