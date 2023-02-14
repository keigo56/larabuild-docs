# Setup Laravel Sanctum

## Introduction
Laravel Sanctum provides a featherweight authentication system for SPAs (single page applications), mobile applications, and simple, token based APIs. Sanctum allows each user of your application to generate multiple API tokens for their account. These tokens may be granted abilities / scopes which specify which actions the tokens are allowed to perform.
## Check Database Connection
Before creating migrations, make sure that we are connected to the database. This is to ensure that when we convert our migrations to actual SQL queries, it will not throw any error.
1. Open PhpMyAdmin, visit [http://localhost:8080/phpmyadmin](http://localhost:8080/phpmyadmin)
2. Create a new database
3. Open <code>.env</code> file and update the following keys:
   ``` shell
   DB_DATABASE=database_name
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Open terminal, go inside the project directory and run:
   ``` shell
   php artisan migrate
   ```
5. Check if new tables are inserted in the newly created database in PhpMyAdmin. If so, then you are good to go.

## Check Table Hierarchy
Before we create migrations files, make sure that the order of migrations to be created is correct. Parent tables are first created before child tables. This is to prevent errors when creating foreign key constraints for each table.

## Create Migration File
1. Open terminal and enter:
    ``` sh
    php artisan make:migration migration_file_name
    ```
   ### Migration Name Guidelines
   1. Migration names should be in snake case format
   2. Follow the <code>"create_" + plural_table_name + "_table"</code> format for migrations that creates new table
   ``` sh
    Examples:
   
    create_users_table
    create_drivers_table
   ```
2. Open the migration file located in <code>database/migrations</code> directory.
3. Specify the column names and column types on the migration file.
   ``` php
    Schema::create('users', function (Blueprint $table) {
       $table->id();
       $table->string('name');
       $table->timestamps();
    });
   ```
   ### Column Types Guidelines
   1. Primary key should be integer datatype only. Use <code>bigInteger</code> only if the table is expected to hold a large amount of data.
      ``` php
       Schema::create('users', function (Blueprint $table) {
         $table->integer('id')->primary();
       });
      ```
   2. For columns that holds strings, specify the length accordingly:
      ``` php
       Schema::create('users', function (Blueprint $table) {
         $table->string('name', 50);
       });
      ```  
   3. For creating foreign key, follow the below format:
      ``` php
       Schema::create('users', function (Blueprint $table) {
            $table->integer('foreign_key');
            $table->foreign('foreign_key')
                ->references('key') // column name in the foreign table
                ->on('foreign_table'); // foreign table name
        });
      ```  
      For a complete list of all column types available, visit [here](https://laravel.com/docs/9.x/migrations#available-column-types)
## Run Migration File
Once the migration file is created, we can now run it to reflect on the database schema:
``` sh
php artisan migrate
```
The above command will only migrate newly created migrations. If you want to rerun all migrations:
``` sh
php artisan migrate:fresh
```
Note that <code>migrate:fresh</code> command will drop all tables, so this command is used only in local development

