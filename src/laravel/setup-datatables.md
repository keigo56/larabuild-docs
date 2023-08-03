# Setup Datatable

## Create Datatable Instance
1. Register datatable endpoint in routes <code>routes/api.php</code> file. There are two endpoints needed dataset and export.
2. Create or specify Controller where the Datatable instance will be created.
3. Create a constructor function inside the controller
4. To initialize a basic Datatable instance copy the code below and insert in the constructor. Make sure that classes are imported to avoid potential errors.
## Specify Database Query
1. Datatable instance accepts Eloquent Query or Raw Database Query
2. Sample Eloquent Query
3. Sample Raw Database Query
## Specify Columns
1. Datatable instance needs Column Definition to serve as a guide of the frontend on how to display data
2. Column available data type are string, numeric, boolean, date.
3. Column Visibility
4. Column Label
5. Column Key

## Dataset Implementation

## Customize Pagination Size

## Export Implementation

## Mapping Row Values


