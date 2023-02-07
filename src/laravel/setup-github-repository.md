# Setting up GitHub Repository

## Create local repository

1. Make sure that you are inside the project directory before running any git command. 

``` bash
cd C:/laragon/www/laravel-project
```

2. To initialize a git repository, run:

``` bash
git init
```

3. Once the repository has been initialized, open GitHub Desktop to add a local repository.
Click <code>File >> Add a local repository</code> and select the project folder.

![An image](./add-local-repository.gif)

4. We can now add our initial commit:

![An image](./initial-commit.png)

5. Once we have our first commit, we can now add three different branches (local, development, production)
- <code>local</code> source code copy for local development
- <code>development</code> source code copy dedicated for development server
- <code>production</code> production ready code to be pulled on the production server

![An image](./create-branches.gif)

6. We can now publish our repository to GitHub:

![An image](./publish-repository.gif)

6. We can now add collaborators to our project. 
   1. Open Github Desktop
   2. Click <code>View on GitHub</code> 
   3. Go to repository settings
   4. Click <code>Collaborators</code>
   5. Click <code>Add people</code>
   6. Search for the username of the collaborator
   7. Click <code>Add collaborator to this repository</code>
   
![An image](./add-collaborators.gif)

## Clone a GitHub repository

