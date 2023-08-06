# Setup Datatable

## Create Datatable Instance
1. Create a new controller where the datatable instance will be created. For this example we will be creating <code>users</code> datatable.
   ``` shell
   php artisan make:controller API\UsersDatatableController
   ```
2. Open <code>UsersDatatableController</code> file which is located under <code>app/Http/Controllers/API</code> directory and initialize a private <code>$datatable</code> property.
    ``` php{8}
    namespace App\Http\Controllers\API;
    
    use App\Http\Controllers\Controller;
    use App\Modules\Datatables\DataTable;
    
    class UsersDatatableController extends Controller
    {
    	private DataTable $datatable;
    }
    ``` 
   <div style="background-color: #030712; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; font-size: 0.9rem;">
   <h5 style="margin: 0 0 0.5rem; font-size: 1rem">Note</h5>
   Make sure that you import the <code>Datatable</code> class or it will throw errors.
   </div>
3. Create a constructor function inside the controller.
   ``` php{10-13}
   namespace App\Http\Controllers\API;
   
   use App\Http\Controllers\Controller;
   use App\Modules\Datatables\DataTable;
   
   class UsersDatatableController extends Controller
   {
       private DataTable $datatable;
       
       public function __construct()
       {
        // Datatable Instance will be created here
       }
   }
   ``` 
4. Copy the code snippet below and insert in the constructor. Make sure that necessary classes are imported to avoid potential errors.
    ```php
    $this->datatable = DataTable::init()
        ->query(
            User::query()
                ->select(
                    'id',
                    'name',
                    'email',
                )
        )
        ->columns([
            Column::make()
                ->key('id')
                ->label('ID')
                ->numeric()
            ,
            Column::make()
                ->key('name')
                ->label('User Name')
                ->string()
            ,
            Column::make()
                ->key('email')
                ->label('Email')
                ->string()
    ]);
    ```
## Customizing Database Query
Datatable instance accepts either an Eloquent Query or Raw Database Query. You need to call the <code>query</code> function and pass the query builder instance.
```php
$this->datatable = DataTable::init()
  ->query(
      // This is where you put the query of the datatable
  );
```
1. Sample Eloquent Query
   ```php {3-8}
   $this->datatable = DataTable::init()
        ->query(
            User::query()
                ->select(
                   'id',
                   'name',
                   'email',
                )   
        );
   ```
2. Sample Raw Database Query
   ```php {3}
   $this->datatable = DataTable::init()
        ->query(
            DB::table(DB::raw('(SELECT * FROM users) as tbl'))
        );
   ```
## Customizing Columns
Datatable instance needs Column Definition to serve as a guide of the frontend on how to display data. To define columns you need to call the <code>columns</code> function:
```php
$this->datatable = DataTable::init()
     ->query(
         User::query()
             ->select(
                 'id',
                 'name',
                 'email',
             )
     )
     ->columns([
     	// THIS IS WHERE YOU DEFINE COLUMNS FOR YOUR DATATABLE
     	// WHATEVER YOU DEFINE HERE IS WHAT WILL BE RETURNED ON THE API AND WHAT THE FRONTEND WILL PROCESS
	 ]);
```
To add a column:
```php {11-14}
$this->datatable = DataTable::init()
     ->query(
         User::query()
             ->select(
                 'id',
                 'name',
                 'email',
             )
     )
     ->columns([
     	Column::make()
            ->key('id')
            ->label('ID')
            ->numeric()
	 ]);
```
Available methods:
- <code>key(string $key)</code>
	Specifies the key of the column on the query result
- <code>label(string $label)</code>
	Specifies the label or text display of the column on the frontend
- <code>visible(boolean $isVisible)</code>
    Specifies the visibility of the column on the frontend
- <code>string()</code>
    Specifies that the column holds a string value
- <code>numeric()</code>
    Specifies that the column holds a numeric value
- <code>boolean()</code>
    Specifies that the column holds a boolean value
- <code>date()</code>
    Specifies that the column holds a date value

## Dataset Implementation
1. Open <code>routes/api.php</code> file and register <code>/datatable/users</code> endpoint. Specify the controller where the Datatable instance is defined and name the function <code>dataset</code>.
    ```php
    Route::post('/datatable/users', [\App\Http\Controllers\Api\UserController::class, 'dataset'])->middleware(['can:view_users']);
    ```
   <div style="background-color: #030712; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; font-size: 0.9rem;">
   <h5 style="margin: 0 0 0.5rem; font-size: 1rem">Note</h5>
   The reason we're using the POST method instead of the GET method for the defined endpoint is due to the usage of a datatable instance. Datatables allow filtering, searching, and sorting of data, and this data is typically sent as a payload in the request. Since this payload can't be effectively included as query parameters in the URL, the POST method is used instead. This allows us to send the necessary data in the request body, ensuring that the datatable can perform its functions properly.
   </div>
2. Open the controller file and create <code>dataset</code> function.
   ```php
   public function dataset(Request $request)
    {
        try {

            $datatable =
                $this->datatable
                    ->filter($request->input('filters'))
                    ->search($request->input('search'))
                    ->sortBy($request->input('sort_by'), $request->input('sort_direction'))
                    ->paginate()
            ;

            return response()->json([
                'datatable' => $datatable
            ]);

        }catch (Exception $exception){
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
   ```
   If you take closely on the code snippets below:
   ```php
    $datatable =
    	$this->datatable
    		->filter($request->input('filters'))
    		->search($request->input('search'))
    		->sortBy($request->input('sort_by'), $request->input('sort_direction'))
    		->paginate()
    ;
   ```
   - <code>filter(array $filters)</code> accepts array of filters for the datatable
   - <code>search(string $searchedTerm)</code> accepts string on what to search on the datatable
   - <code>sortBy(string $column, string $direction)</code> specifies sort column and sort direction on the datable
   - <code>paginate(int $pageSize = 15)</code> specifies that data returned needs to be paginated and the default page size is 15 rows.

## Export Implementation
1. Open <code>routes/api.php</code> file and register <code>/datatable/users/export</code> endpoint. Specify the controller where the Datatable instance is defined and name the function <code>export</code>.
    ```php
    Route::post('/datatable/users/export', [\App\Http\Controllers\Api\UserController::class, 'export'])->middleware(['can:export_users']);
    ```
2. Open the controller file and create <code>export</code> function.
   ```php
   public function export(Request $request)
    {
        try {

            activity()
                ->log('User exported users.csv');

            $filePath = $this->datatable
                ->filter($request->input('filters'))
                ->search($request->input('search'))
                ->sortBy($request->input('sort_by'), $request->input('sort_direction'))
                ->exportName('users')
                ->export();

            return response()
                ->download(Storage::path($filePath))
                ->deleteFileAfterSend();

        }catch (Exception $exception){
            return response()->json([
                'error' => true,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
   ```
   If you take closely on the code snippets below:
   ```php
    activity()
        ->log('User exported users.csv');
    ;
   ```
   The code above just adds new entry on the audit trail and specifies that the user exported the datatable.

   ```php
   $filePath = $this->datatable
       ->filter($request->input('filters'))
       ->search($request->input('search'))
       ->sortBy($request->input('sort_by'), $request->input('sort_direction'))
       ->exportName('users')
       ->export();
   ;
   ```
   - <code>filter(array $filters)</code> accepts array of filters for the datatable
   - <code>search(string $searchedTerm)</code> accepts string on what to search on the datatable
   - <code>sortBy(string $column, string $direction)</code> specifies sort column and sort direction on the datable
   - <code>exportName(string $exportName)</code> specifies the name of the export file.
   - <code>export()</code> function exports the datatable in a csv file and returns the file path of the csv.

   ```php
   return response()
       ->download(Storage::path($filePath))
       ->deleteFileAfterSend();
   ;
   ```
   The code above returns an API response downloading the csv file created based on the file path returned of the <code>export</code> function and deleting the file after the request has been sent.

## Mapping Row Values


