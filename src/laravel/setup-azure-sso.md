# Setup Azure SSO

## Introduction
Azure SSO (Single Sign-On) in Laravel is a feature that allows users to sign in to a Laravel application using their Azure Active Directory (AD) credentials. This feature leverages the OAuth 2.0 protocol and Microsoft's Azure AD authentication and authorization services to provide secure authentication and authorization for Laravel applications. With Azure SSO in Laravel, users can sign in with their existing Azure AD credentials, reducing the need for them to create and remember new login credentials for the Laravel application.
## Setup Azure SSO Credentials
Before we start creating our authentication logic for our Azure SSO, we must first obtain our Azure credentials and save it in our <code>.env</code> file:
```shell
OAUTH_APP_ID=
OAUTH_APP_SECRET=
OAUTH_REDIRECT_URI=http://localhost:8000/sso/callback
OAUTH_APP_REDIRECT_URI=http://localhost:8000/app/sso/callback
OAUTH_SCOPES='user.read'
OAUTH_AUTHORITY=https://login.microsoftonline.com/common
OAUTH_AUTHORIZE_ENDPOINT=https://login.microsoftonline.com/599e51d6-2f8c-4347-8e59-1f795a51a98c/oauth2/v2.0/authorize
OAUTH_TOKEN_ENDPOINT=https://login.microsoftonline.com/599e51d6-2f8c-4347-8e59-1f795a51a98c/oauth2/v2.0/token
```
The above credentials can all be found inside your Azure AD settings. 

## Install Packages
Now that we have our credentials ready in our <code>.env</code> file, we can now install required packages for our Azure SSO:

### Install <code>league/oauth2-client</code> package
League OAuth2 client is a PHP package that provides a simple and convenient way to integrate OAuth 2.0 authentication in PHP applications, including Laravel. It provides a client implementation of the OAuth 2.0 specification and handles the authentication flow between the application and the OAuth 2.0 server:
```shell
composer require league/oauth2-client
```
### Install <code>microsoft/microsoft-graph</code> package
The "microsoft/microsoft-graph" package in Laravel is a PHP library that provides a simple and convenient way to integrate Microsoft Graph API in PHP applications, including Laravel. Microsoft Graph API is a RESTful API that allows developers to access a wide range of Microsoft services, such as Azure AD, Office 365, and OneDrive, with a single endpoint.
```shell
composer require microsoft/microsoft-graph
```
## Create Azure SSO Service Class
Now that we have installed the required packages, we can now start building our authentication logic for our Azure AD SSO. We will create a Service class, and we will start implementing our authentication logic in it:
1. Go to <code>app/</code> directory and create a new folder named <code>Services</code>
2. Inside the <code>app/Services/</code> directory, create a new PHP class named <code>AzureSSOService</code>
3. Copy and paste this code inside the <code>AzureSSOService</code> class:
```php
<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Exception\GuzzleException;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GenericProvider;
use League\OAuth2\Client\Token\AccessToken;
use Microsoft\Graph\Exception\GraphException;
use Microsoft\Graph\Graph;
use Microsoft\Graph\Model\User;

class AzureSSOService
{
    /*
     * Returns the Azure OAuth Client which can be used to connect to Azure AD API
     * */
    private function getOAuthClient(): GenericProvider
    {
       return new GenericProvider([
            'clientId'                => config('services.azure.app_id'),
            'clientSecret'            => config('services.azure.secret'),
            'redirectUri'             => config('services.azure.redirect_uri'),
            'urlAuthorize'            => config('services.azure.authorize_endpoint'),
            'urlAccessToken'          => config('services.azure.token_endpoint'),
            'scopes'                  => config('services.azure.scopes'),
            'urlResourceOwnerDetails' => '',
        ]);
    }

    public function getAuthorizationURLAndClientState(): array
    {
        /*
         * Initialize the Oauth Client to use Azure AD API
         * */
        $client = $this->getOAuthClient();

        /*
         * Generate the Authorization URL where users will sign in
         * Generate the Client State for verification purposes
         *
         * Options [prompt => consent]:
         * This ensures that users will have to accept the permissions requested once sign in is successful
         *
         * */
        return [
            'url' => $client->getAuthorizationUrl(['prompt' => 'consent']),
            'state' => $client->getState()
        ];
    }

    /*
     * Returns if the OAuth State is valid
     * */

    /**
     * @throws Exception
     */
    public function isValidOAuthState(string|null $expectedState, string|null $providedState): bool
    {
        if (!isset($expectedState)) {
            throw new Exception('Invalid OAuth State');
        }

        if (!isset($providedState)) {
            throw new Exception('Invalid OAuth State');
        }

        if ($expectedState !== $providedState) {
            throw new Exception('Invalid OAuth State');
        }

        return true;
    }

    /*
     * Returns if the OAuth Code is valid
     * */
    /**
     * @throws Exception
     */
    public function isValidAuthorizationCode(string $authorizationCode): bool
    {
        if (!isset($authorizationCode)) {
            throw new Exception('Invalid Authorization Code');
        }

        return true;
    }

    /*
    * Returns the access token to be used in querying the Microsoft Graph API
    * */
    /**
     * @throws Exception
     */
    public function getAccessToken(string $authorizationCode): AccessToken|bool
    {
        /*
        * Initialize the Oauth Client to use Azure AD API
        * */
        $client = $this->getOAuthClient();

        try {
            return $client->getAccessToken('authorization_code', [
                'code' => $authorizationCode
            ]);
        }catch (IdentityProviderException $e) {
            throw new Exception('Cannot get access token for OAuth Client');
        }
    }

    /*
    * Returns the authenticated user from Azure AD
    * */
    /**
     * @throws Exception
     */
    public function getAzureSSOUser(AccessToken $token)
    {
        /*
         * Initializes the Microsoft Graph API
         * Sets the access token for the Graph API
         * */
        $graph = new Graph();
        $graph->setAccessToken($token->getToken());

        try {
            return $graph
                ->createRequest('GET', '/me')
                ->setReturnType(User::class)
                ->execute();
        } catch (GuzzleException|GraphException $e) {
            throw new Exception('Cannot get Azure SSO User');
        }
    }
}
```
## Create Azure SSO Controller
After we implement the implementation for Azure Authentication, we can now create our controller to save our authenticated user and provide access token:
1. Create the <code>AzureSSOController</code> class:
   ``` shell
   php artisan make:controller Authentication\AzureSSOController
   ```
2. Open the controller file located in <code>app\\Http\\Controllers\\Authentication\\</code> directory
3. Copy and paste this code inside the <code>AzureSSOController</code> class:
```php
<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AzureSSOService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AzureSSOController extends Controller
{
    public function app_sso_login()
    {
        $azureService = new AzureSSOService();

        $authorizationURLAndClientState = $azureService->getAuthorizationURLAndClientState();
        $authorizationURL = $authorizationURLAndClientState['url'];
        $state = $authorizationURLAndClientState['state'];

        session(['oauthState' => $state]);
        return redirect()->away($authorizationURL);
    }

    public function app_sso_callback(Request $request)
    {

        try {

            $azureService = new AzureSSOService();
            $expectedState = session('oauthState');
            $request->session()->forget('oauthState');
            $providedState = $request->query('state');

            $azureService->isValidOAuthState($expectedState, $providedState);
            $authorizationCode = $request->query('code');
            $azureService->isValidAuthorizationCode($authorizationCode);
            $accessToken = $azureService->getAccessToken($authorizationCode);
            $authenticatedUser = $azureService->getAzureSSOUser($accessToken);


            /*
             * Checks on the database if the user email exists on "users" table
             * */
            $userExists = User::query()
                ->where('email', '=', $authenticatedUser->getMail())
                ->exists();


            /*
             * If the user does not exist in the database,
             * create a new user record with the authenticated user's email and display name.
             * Otherwise, retrieve the existing user record from the database.
             * */

            $user = !$userExists ?
                User::query()
                    ->create([
                        'email' => $authenticatedUser->getMail(),
                        'name' => $authenticatedUser->getDisplayName(),
                        'password' => Hash::make('password'),
                    ]) :
                User::query()
                    ->where('email', '=', $authenticatedUser->getMail())
                    ->first();


            /*
             * Delete all active tokens of the user
             * This is to ensure that only one session is active at a time
             * */
            $user->tokens()->delete();

            /*
             * Create the access token
             * Note that by default, this access token does not expire
             * We can update the expiration duration in the config settings
             * */
            $access_token = $user->createToken('access_token')->plainTextToken;

            /*
             * Forward the access token to our frontend URL
             * */

            $forwardURL = config('services.azure.frontend_uri') . "/auth/validate?token={$access_token}";

            return redirect()->away($forwardURL);

        }catch (Exception $exception){
            return response()->json([
                'error' => $exception->getMessage()
            ], 500);
        }
    }

    public function sso_logout()
    {
        /*
         * Get the authenticated user and delete all the tokens associated with it
         * */
        $user = auth()->user();
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'User logout successfully'
        ]);
    }
}

```

## Create Azure SSO Routes
Now that are login implementation is ready, we can now register it in our <code>web.php</code> routes file:
```php
<?php

use App\Http\Controllers\Authentication\AzureSSOController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('sso/login', [AzureSSOController::class, 'app_sso_login'])->name('app.sso.login');
Route::get('sso/callback', [AzureSSOController::class, 'app_sso_callback'])->name('app.sso.callback');
```

To register our logout endpoint, open <code>api.php</code> routes file and paste the following:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->delete('/auth/logout', [\App\Http\Controllers\Authentication\AzureSSOController::class, 'sso_logout']);

```
