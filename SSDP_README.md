# Student Skill Development and Placement Preparation Portal (SSDP)

A frontend-focused web application designed to help students organize
their learning and prepare for placement assessments. The portal
provides a student dashboard, profile management, topic-wise practice,
and mock tests.

## Project Overview

The Student Skill Development and Placement Preparation Portal (SSDP)
brings key placement-preparation activities into one interface. Students
can view their preparation activity, manage their profile, practise
questions by topic, and attempt mock tests.

This project is implemented using HTML, CSS, and JavaScript. Browser
Local Storage is used for client-side data persistence.

## Features

### Student Dashboard

-   Displays a personalized welcome area.
-   Shows preparation statistics, including practice questions attempted
    and mock-test performance.
-   Provides quick links to practice, mock tests, and profile
    management.
-   Displays preparation progress.

### Student Profile

-   View and edit personal information.
-   Maintain academic details such as college, course, semester, and
    expected graduation year.
-   Add or update technical skills.

### Practice Zone

-   Provides topic-wise practice questions.
-   Displays practice activity and answer accuracy.
-   Supports practice across topics such as HTML, CSS, and JavaScript.

### Mock Tests

-   Offers mock-test options at different difficulty levels.
-   Displays test information, including question count and duration.
-   Tracks completed tests and score summaries.

## Technology Stack

  Area                           Technologies
  ------------------------------ ---------------------------------
  Structure                      HTML5
  Styling                        CSS3
  Client-side functionality      JavaScript
  Client-side data persistence   Browser Local Storage
  Local development              Visual Studio Code, Live Server
  Version control                Git and GitHub

## Project Structure

``` text
SSDP-Portal/
├── assets/
│   ├── Icons/
│   ├── images/
│   ├── logo/
│   └── Logos/
├── css/
│   ├── auth.css
│   ├── dashboard.css
│   ├── mocktest.css
│   ├── practice.css
│   ├── profile.css
│   └── style.css
├── js/
│   ├── auth.js
│   ├── dashboard.js
│   ├── mocktest.js
│   ├── practice.js
│   ├── profile.js
│   └── storage.js
├── dashboard.html
├── index.html
├── mocktest.html
├── practice.html
├── profile.html
├── register.html
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

-   A modern web browser.
-   Visual Studio Code.
-   Visual Studio Code Live Server extension (recommended).

### Run Locally

1.  Clone the repository:

    ``` bash
    git clone https://github.com/bharatho11/Student-Skill-Development-and-Placement-Portal.git
    ```

2.  Open the project folder in Visual Studio Code:

    ``` bash
    cd Student-Skill-Development-and-Placement-Portal
    code .
    ```

3.  In VS Code, open `index.html`.

4.  Right-click the file and select **Open with Live Server**.

5.  Use the portal navigation to open the dashboard, profile, practice
    zone, and mock tests.

You can also open `index.html` directly in a browser, but Live Server is
recommended so all pages use the same local origin and browser Local
Storage.


## Data Storage

The application uses browser Local Storage for client-side persistence.
Data is stored in the browser for the local origin used to access the
portal. Clearing browser storage or using a different browser or origin
may remove or make that data unavailable.

## Current Scope and Limitations

-   This is a frontend-focused project.
-   The application uses browser Local Storage; no server-side backend
    or centralized database is included in this project.
-   Data is local to the browser and is not automatically shared between
    devices or users.
-   The `assets/` subfolders in the current project structure are empty;
    add the required image and logo files if the application needs them.

## Future Enhancements

-   Integrate a backend and database for centralized student accounts
    and progress.
-   Add administrator and trainer features.
-   Expand the practice question bank and mock-test categories.
-   Add detailed performance reports and progress analytics.
-   Deploy the application so it can be accessed online.

## Author

**Bharath O**

-   GitHub: [bharatho11](https://github.com/bharatho11)
-   LinkedIn: [Bharath O](https://www.linkedin.com/in/bharath-o)

## License

No license has been specified for this repository. Contact the author
for permission before reusing or distributing the project.
