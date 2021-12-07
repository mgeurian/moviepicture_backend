# MoviePicture

## Description

- MoviePicture is place for users to create and track a list of movies the user has seen.
- This is a full-stack application written with Express, Postgresql, React, and Bootstrap for styling.
- This application was created as a Capstone Project for the Springboard Software Engineering Program.


## Current Features

- Users can
    - create a profile/account.
    - update their profile information.
    - search for movies to add to their list.
    - add movies to their list.
    - remove movies from their list.

## Roadmap

- Users will be able to 
    - view another users's movie list. 
    - add a list of tv series.
    - remove/delete their profile/account.
    - view movies they want to see.
    - view a reduced list of multiple users lists to view movies ALL grouped users have/haven't seen.


- Additional Future Features:

    - There are many possible features to add. 
    - There are many UI/UX design features that can be improved or added.


## Walkthrough

1. To start, signup or Login for an account.
1. The navigation bar has 3 links. 
  1. My Movies will take you directly to your list of existing movies. 
  1. Profile will take you to your profile page. 
    1. The Profile page allow you to edit your first name, last name, or email.
  1. The Log out is pretty self explanatory. However, should you wish to log out of your account, click this link.
1. Enter a movie title for which to search.
    1. The screen will populate with a list of movies.
    1. To Add a movie to your list:

        1. Click on a movie. 
            1. Click on the 'green' ADD button.
                1. after adding a movie, the user will be re-directed to their list of movies.
    1. To Remove a movie from your list:
        1. Click on a movie.
            1. Click on the 'red' REMOVE button.
1. To finish, click on "Log out (username)" on the navbar at the top of your screen.


## Working with this codebase


### The Database



### The Backend

The backend was created using Express and Postgresql. This application utilizes the Open Movie Database API. If you would like to play around with this appliation on a local machine, you will need to sign up for a free API key with your email.



### The Frontend

The frontend was created with Create-React-App. React-bootstrap was used to for styling most components.


### Installation

In the project directory,

#### Backend


```
cd moviepicture-backend
npm install
```


#### Frontend

```
cd moviepicture-frontend
npm install
```


### Testing

#### Backend

```
cd moviepicture-backend
npm test
```

#### Frontend

```
cd moviepicture-frontend
npm test
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

MIT License

Copyright (c) [2021] [Matt C Geurian]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
