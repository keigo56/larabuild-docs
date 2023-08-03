# Create API Endpoint

## Register Endpoint in API routes
In Laravel, API endpoints are URLs that clients can use to interact with your application and perform specific actions. These endpoints are responsible for handling incoming requests, executing the necessary logic, and returning responses in a desired format, such as JSON.
1. Navigate to the <code>routes/api.php</code> file. This file is specifically dedicated to defining routes for API endpoints.
2. In the api.php file, use Laravel's route methods to define the endpoints. The most commonly used methods are <code>Route::get()</code>, <code>Route::post()</code>, <code>Route::put()</code>, and <code>Route::delete()</code>, which correspond to different HTTP methods.
   Below are guidelines on when to use:
   - <code>GET</code> is commonly used for retrieving API data, or any information from a server.
   - <code>POST</code> is used for submitting form data, creating new resources, or sending data to be processed.
   - <code>PUT</code> is used for updating or replacing an entire resource on the server.
   - <code>DELETE</code> is used for removing a specific resource from the server.
3. Define the route by specifying the URL path and the corresponding controller method that will handle the request. Here's an example of registering a GET endpoint:
   ``` php
   Route::get('/endpoint', [ControllerName::class, 'methodName']);
   ```
   In the above code, replace <code>/endpoint</code> with the desired URL path for your endpoint. Replace <code>ControllerName</code> with the name of your controller class, and <code>methodName</code> with the name of the method in the controller that will handle the request.

## Setup Controller
In Laravel, controllers are a fundamental part of the MVC (Model-View-Controller) architectural pattern. They act as intermediaries between the routes and the business logic of the application. Controllers are typically located in the <code>app/Http/Controllers</code> directory.
### Create Controller
``` shell
php artisan make:controller API\ControllerName
```
Replace <code>ControllerName</code> with the name of your controller class and make sure that the name is in singular form. Examples are  <code>DriverController</code>,<code>RoomController</code>, <code>BookController</code>.
### Create Controller method
1. Navigate to the <code>app/Http/Controllers</code> directory. This is where controllers are located.
2. Identify the controller in which you want to create the method. For example, if you want to create a method in a controller named <code>UserController</code>, open the <code>UserController.php</code> file.
3. Inside the controller class, add a new public method based on the action the method will perform:
   ```php
   public function getAllUsers(Request $request)
   {
     // Logic to fetch all users
     // Return a response or perform other actions
   }
   ```
## API Implementation
### Validate API Payload
Laravel payload validation refers to the process of validating the data or payload received in an HTTP request in a Laravel application. It involves verifying that the incoming data meets certain criteria, such as required fields, data types, length limits, and more.
```php
public function getAllUsers(Request $request)
{
  $request->validate([
    'field1' => ['required', 'string'],
    'field2' => ['required', 'numeric'],
    'field3' => ['required', 'min:3', 'max:3'],
  ]);
}
```
For a complete list of all Laravel Validations Rules available, visit [here](https://laravel.com/docs/10.x/validation#available-validation-rules)
### Try and Catch
In Laravel controllers, using try and catch blocks is crucial for effective error handling and ensuring the stability of the application. By encapsulating the code within these blocks, the method can gracefully handle exceptions and prevent crashes or generic error messages.
```php
public function getAllUsers(Request $request)
{
  $request->validate([
    'field1' => ['required', 'string'],
    'field2' => ['required', 'numeric'],
    'field3' => ['required', 'min:3', 'max:3'],
  ]);
  
  try {

    //API IMPLEMENTATION HERE
              
  }catch (Exception $exception){
      return response()->json([
          'error' => true,
          'message' => $exception->getMessage(),
      ], 500);
  }
}
```
### Get API Payload
In Laravel, an API payload refers to the data that is sent or received in API requests and responses. It typically consists of structured information in a specific format, such as JSON (JavaScript Object Notation). 

When you make an API request in Laravel, you typically send a payload containing data that the API endpoint expects. This payload can include parameters, such as query parameters or request body data, which are necessary for the API to perform the desired operation. For example, when creating a new resource through an API, you might send a payload containing the necessary data fields like name, email, and password.

You can access the API payload through the <code>$request</code> object. The payload data can be found in the request body, headers, or query parameters, depending on how it is sent.
```php
$name = $request->input('name');
$email = $request->input('email');
```
### Query Database
One of your API endpoints may require querying the database. Laravel provides a comprehensive set of tools and features to facilitate seamless database interactions. With Laravel, you can leverage the powerful Eloquent ORM or the flexible query builder to perform CRUD operations, define relationships, apply query scopes, and optimize database queries.
#### Retrieving Data
- Retrieving Single Record
```php
// Retrieve a single record by primary key
$user = User::find(1);
    
// Retrieve a single record with one condition
$user = User::query()
           ->where('email', 'johndoe@email.com')
           ->first();
 
// Retrieve a single record with multiple conditions
$user = User::query()
           ->where('email', 'johndoe@email.com')
           ->where('name', 'John Doe')
           ->first();
```   
- Retrieving Multiple Records
```php
// Retrieve records based on conditions
$users = User::query()
            ->where('age', '>', 18)
            ->orderBy('name')
            ->get();
 
// Retrieve based on multiple conditions
$users = User::query()
           ->where('age', '>', 18)
           ->where('is_active', true)
           ->orderBy('name')
           ->get();
```   
- Retrieving Multiple Records with Joins
```php
// Retrieve records based on conditions with joins
$users = User::query()
            ->select('users.name', 'users.email', 'employees.wdid')
            ->join('employees', 'users.email', '=', 'employees.email')
            ->where('users.age', '>', 18)
            ->orderBy('users.name')
            ->get();
```   
#### Inserting Data
```php
// Inserting single record
User::create([
  'name' => 'John Doe',
  'email' => 'john@example.com'
]);
 
// Inserting multiple records
User::create([
  [
   'name' => 'John Doe',
   'email' => 'john@example.com'
  ],
  [
   'name' => 'Michelle Jones',
   'email' => 'michellejones@example.com'
  ]
]);
```   
#### Updating Data
```php
// Updating a single record
// Retrieve record first using primary key
$user = User::find(1);
$user->update([
  'name' => 'John Doe',
  'email' => 'john@example.com'
]);

// Updating record based on condition
User::query()
    ->where('email', 'john@example.com')
    ->update([
      'name' => 'John Doe',
      'email' => 'john@example.com'
     ]);

// Updating multiple records
User::query()
    ->where('age', '>', '60')
    ->update([
      'is_active' => false,
    ]);
``` 
#### Deleting Data
```php
// Deleting a single record
// Retrieve record first using primary key
$user = User::find(1);
$user->delete();

// Deleting record based on condition
User::query()
    ->where('email', 'john@example.com')
    ->delete();

// Deleting multiple records
User::query()
    ->where('age', '>', '60')
    ->delete();
``` 
### Implement API
API Implementation may vary depending on the business logic. But below are some of general guidelines when implementing an API.
1. <h4 style="margin-bottom: 0">Request Validation</h4>
    Laravel provides powerful validation features that you can leverage to validate incoming API requests. Use Laravel's validation rules to ensure that the data sent to your API endpoints is valid and meets the expected criteria.
2. <h4 style="margin-bottom: 0">Use Database Transactions</h4>
   When implementing an API that does involve multiple mutations on different tables, using database transactions can be beneficial to ensure data integrity and consistency.
3. <h4 style="margin-bottom: 0">Early function returns</h4>
   Using early function returns is a programming technique that involves returning from a function as soon as a certain condition is met, rather than continuing with the remaining code. This approach can improve code readability, simplify logic, and potentially enhance performance.
### Create Appropriate API Response
Creating a proper API response in Laravel involves structuring the response in a consistent and standardized format that includes relevant information and appropriate HTTP status codes.
1. Set the HTTP Status Code: Determine the appropriate HTTP status code based on the outcome of the API request. Laravel provides convenient methods to set the status code using the <code>response()</code> function:
   ```php
   return response()->json([
     'users' => $users,
     'email' => $email
    ], 200);
   ```
    - 200 OK: The request was successful, and the server has returned the requested resource. This is the most common response code for successful requests.
    - 201 Created: The request has been successfully fulfilled, and a new resource has been created as a result. This is typically used for successful POST requests that result in resource creation.
    - 204 No Content: The server has successfully processed the request, but there is no content to return. This is often used for successful DELETE or PUT requests where the server does not need to return any additional data.
    - 422 Unprocessable Entity is used to indicate that the server understands the request, but it cannot process it due to semantic errors or validation failures. It is typically used when there are issues with the submitted data that prevent the server from processing the request successfully.
    - 401 Unauthorized: The request requires user authentication. The client must provide valid credentials (such as a username and password) to access the requested resource.
    - 403 Forbidden: The server understood the request, but the client does not have the necessary permissions to access the requested resource. Unlike 401, authentication will not help in this case.
    - 404 Not Found: The server could not find the requested resource. This response code is often used when the URL or endpoint does not exist or when a specific resource cannot be found.
## Add Endpoint Logging
## Setup API Middleware