# Create Models

## Introduction
Laravel includes Eloquent, an object-relational mapper (ORM) that makes it enjoyable to interact with your database. When using Eloquent, each database table has a corresponding "Model" that is used to interact with that table. In addition to retrieving records from the database table, Eloquent models allow you to insert, update, and delete records from the table as well.

## Generate Model Classes
To get started, let's create an Eloquent model. Models typically live in the <code>app\Models</code> directory. You may use the make:model command to generate a new model:
``` shell
php artisan make:model ModelName
```
### Model Name Guidelines
1. Model names should be in Pascal Case
2. Model names should be in singular form

Examples can be: <code>Driver</code>, <code>Schedule</code>, <code>TrainingRoom</code>

## Specify Table Name
In order for our model to work, we must specify which table to connect to. We can do it by defining a table property on the model:
```php
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Driver extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'drivers';
}
```

## Specify Fillable Properties
The <code>$fillable</code> property is used to specify which attributes of a model can be mass assigned. When creating or updating a model using the <code>create()</code> or <code>update()</code> methods, only the attributes listed in the <code>$fillable</code> property will be assigned. All other attributes will be ignored for security reasons, to prevent unintended or malicious changes to the model.

To specify fillable properties of the model:
```php
<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Driver extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
     protected $fillable = ['name', 'phone_number'];
}
```

