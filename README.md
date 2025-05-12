# To Do List
A To Do List web application to manage and organize user's tasks.  

- Link to Website: https://to-do-list-2ksf.onrender.com
- Run Website Locally: [Local Setup](#local-setup)

## Technologies Used 
- Frontend: HTML, CSS, JavaScript, Bootstrap  
- Backend: Python, Flask, Jinja2
- Database Management: SQLite3, SQLAlchemy  

## Key Features
- Add Multiple Tasks
- Assign Due Dates
- Mark Tasks as Favourite
- Mark Tasks as Complete
- Add Labels to Tasks
- Set Priority
- Sort Tasks by Date Added, Due Date, or Priority
- Edit Tasks
- Delete Tasks

## Local Setup
1. Clone the Repository
```bash
git clone https://github.com/ssmathoun/To-Do-List.git
cd To-Do-List

```

2. Create a Virtual Environment
- macOS/Linux
```bash
python3 -m venv venv
```
- Windows (CMD)
```bash
python -m venv venv
```
- Windows (PowerShell)
```bash
python -m venv venv
```

3. Activate the Virtual Environment
- macOS/Linux
  ```bash
  source venv/bin/activate
  ```
- Windows (CMD)
  ```bash
  venv\Scripts\activate.bat
  ```
- Windows (PowerShell)
  ```bash
  venv\Scripts\Activate.ps1
  ```
  
4. Install the Dependencies
```bash
pip install -r requirements.txt
```

5. Set Up ```.env``` file
```bash
FLASK_APP=main.py
FLASK_KEY=your_secret_key
DB_URI=sqlite:///tasks.db
```

6. Run the Application
```bash
flask run
```




