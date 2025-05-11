from flask import Flask, render_template, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship, DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, Boolean, nullslast, ForeignKey
from forms import AddTaskForm, EditTaskForm, LoginForm, RegisterForm
from flask_bootstrap import Bootstrap5
from functools import wraps
from flask_login import UserMixin, login_user, LoginManager, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
import email_validator
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get('FLASK_KEY')
bootstrap = Bootstrap5(app)

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(User, user_id)


class Base(DeclarativeBase):
    pass

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DB_URI", "sqlite:///posts.db")
db = SQLAlchemy(model_class=Base)
db.init_app(app)


class Task(db.Model):
    """
    A database model to represent a User's Task.

    Attributes:
        __tablename__ (str) -- Name of the table for Task.
        id (int) -- Unique ID for a task.
        task (str) -- The name of the task.
        is_favourite (bool) -- Stores whether task is marked as favourite or not.
        due_date (str, optional) -- Due Date for a task.
        priority (int) -- Priority of a task ranging from 1 to 4 with 1 being the highest.
        label (str, optional) -- Label of a task.
        label_color (str, optional) -- The color of the label assigned to a task.
        status (str) -- The status of task completion (e.g. "Complete" and "Not Complete").
        user_id (int) -- Stores the foreign key for the parent database table users.
        user (User) -- One-to-many relationship between user and task where each user can have multiple tasks.
    """
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task: Mapped[str] = mapped_column(String(250), nullable=False)
    is_favourite: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    due_date: Mapped[str] = mapped_column(String(250), nullable=True)
    priority: Mapped[int] = mapped_column(Integer, nullable=False)
    label: Mapped[str] = mapped_column(String(250), nullable=True)
    label_color: Mapped[str] = mapped_column(String(250), nullable=True)
    status: Mapped[str] = mapped_column(String(250), nullable=False, default="Not Complete")
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user = relationship("User", back_populates="task")


class User(UserMixin, db.Model):
    """
    A database model to represent a User.

    Attributes:
        __tablename__ (str) -- Name of the table for User.
        id (int) -- Unique ID for a User.
        email (str) -- Email of the user's account.
        password (str) -- Password of the user's account.
        task (list[Task]) -- One-to-many relationship between user and task where each user can have multiple tasks.
    """
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    task = relationship("Task", back_populates="user")


with app.app_context():
    db.create_all()


def login_required(f):
    """
    Decorator to restrict access to specific routes from unauthenticated users.

    Args:
        f (Callable): The route handler to be protected.

    Returns:
        decorated_function (Callable): Restricts access to unauthenticated users by redirecting them to login page.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('login'))
        return f(*args, **kwargs)

    return decorated_function


@app.route('/register', methods=["GET", "POST"])
def register():
    """
    Registers a user if they enter valid information.

    Renders registration page, processes the form, and creates a new user if
    they are not already registered via their email.

    Returns:
        Response: The HTML page for registration or the main page with tasks if they are
        successfully registered.
    """
    form = RegisterForm()
    if form.validate_on_submit():

        result = db.session.execute(db.select(User).where(User.email == form.email.data))
        user = result.scalar()
        if user:
            flash("You've already signed up with that email, log in instead!")
            return redirect(url_for('login'))

        password = generate_password_hash(
            form.password.data,
            method='pbkdf2:sha256',
            salt_length=8
        )

        new_user = User(
            email=form.email.data,
            password=password,
        )

        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for("get_tasks"))
    return render_template("register.html", form=form, current_user=current_user)


@app.route('/login', methods=["GET", "POST"])
def login():
    """
    Logs in a user if they enter valid information.

    Renders log in page, processes the form, and logs in a user if
    they are already registered.

    Returns:
        Response: The HTML page for log in or the main page with tasks if they are
        successfully logged in.
    """
    form = LoginForm()
    if form.validate_on_submit():
        password = form.password.data
        result = db.session.execute(db.select(User).where(User.email == form.email.data))

        user = result.scalar()

        if not user:
            flash("That email does not exist, please try again.")
            return redirect(url_for('login'))

        elif not check_password_hash(user.password, password):
            flash('Password incorrect, please try again.')
            return redirect(url_for('login'))

        else:
            login_user(user)
            return redirect(url_for('get_tasks'))

    return render_template("login.html", form=form, current_user=current_user)


@app.route('/logout')
@login_required
def logout():
    """
    Logs out a user if they are logged in and requests logging out.

    Returns:
        Response: The HTML page for log in.
    """
    logout_user()
    return redirect(url_for('login'))


@app.route("/")
@login_required
def get_tasks():
    """
    Fetches all the tasks of a user from the database.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    return render_template("index.html", current_user=current_user, label_tasks=labeled_tasks, all_tasks=tasks, form=add_form, edit_form=edit_form)


@app.route("/sort/<sort_by>/<go_to>")
@login_required
def sort_tasks(sort_by, go_to):
    """
    Sorts the task in non-decreasing order by a specific criteria chosen by the user.

    Args:
        sort_by (str): The criteria for sorting.
        go_to (str): The HTML page to load for showing sorted tasks.

    Returns:
        Response: The HTML page specified by go_to parameter with user's sorted tasks.
    """
    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    if go_to == "index":
        if sort_by == "date_added":
            return redirect(url_for("get_tasks"))

        elif sort_by == "due_date":
            result = db.session.execute(db.select(Task).where(Task.user == current_user).order_by(nullslast(Task.due_date)))
            tasks = result.scalars().all()
        elif sort_by == "priority":
            result = db.session.execute(db.select(Task).where(Task.user == current_user).order_by(Task.priority))
            tasks = result.scalars().all()

        return render_template("index.html", label_tasks=labeled_tasks, all_tasks=tasks, form=add_form, edit_form=edit_form)

    elif go_to == "favourites":
        if sort_by == "date_added":
            return redirect(url_for("get_favourites"))
        elif sort_by == "due_date":
            result = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.is_favourite == True).order_by(nullslast(Task.due_date)))
            tasks = result.scalars().all()
        elif sort_by == "priority":
            result = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.is_favourite == True).order_by(Task.priority))
            tasks = result.scalars().all()

        return render_template("favourites.html", label_tasks=labeled_tasks, all_tasks=tasks, form=add_form, edit_form=edit_form)

    elif go_to == "completed":
        if sort_by == "date_added":
            return redirect(url_for("get_completed"))
        elif sort_by == "due_date":
            result = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.status == "Complete").order_by(nullslast(Task.due_date)))
            tasks = result.scalars().all()
        elif sort_by == "priority":
            result = db.session.execute(db.select(Task).order_by(Task.priority).where(Task.user == current_user,  Task.status == "Complete"))
            tasks = result.scalars().all()

        return render_template("completed.html", label_tasks=labeled_tasks, all_tasks=tasks, form=add_form, edit_form=edit_form)


@app.route("/sort/<sort_by>/label/<label_name>")
@login_required
def sort_labeled_tasks(sort_by, label_name):
    """
    Sorts the labeled task in non-decreasing order by a specific criteria chosen by the user.

    Args:
        sort_by (str): The criteria for sorting.
        label_name (str): The label name of tasks to be sorted.

    Returns:
        Response: The HTML page with user's sorted tasks with a specific label.
    """
    if not current_user.is_authenticated:
        flash("You need to login or register to comment.")
        return redirect(url_for("login"))

    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    if sort_by == "date_added":
        return redirect(url_for("get_label_tasks", label=label_name))
    elif sort_by == "due_date":
        result = db.session.execute(db.select(Task).where(Task.user == current_user, Task.label == label_name).order_by(nullslast(Task.due_date)))
        tasks = result.scalars().all()
    elif sort_by == "priority":
        result = db.session.execute(db.select(Task).where(Task.user == current_user, Task.label == label_name).order_by(Task.priority))
        tasks = result.scalars().all()

    return render_template("label.html", label_tasks=labeled_tasks, all_tasks=tasks, form=add_form, edit_form=edit_form)


@app.route("/add", methods=["GET", "POST"])
@login_required
def add_task():
    """
    Adds a task with various specifications for a user in the database table.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    add_form = AddTaskForm()

    if add_form.validate_on_submit():

        is_favourite = "favourite" in request.form
        due_date = request.form.get("due_date")
        priority = request.form.get("priority")
        label = request.form.get("label").title()
        label_color = request.form.get("label-color")
        user = current_user

        if label.strip() == "":
            label = None

        same_label_tasks = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.label == label)).scalars()

        for task in same_label_tasks:
            task.label_color = label_color

        if due_date is None or due_date.strip() == "":
            due_date = None

        if is_favourite:
            new_task = Task(task=add_form.task.data, is_favourite=is_favourite, due_date=due_date, priority=priority,
                            label=label, label_color=label_color, user=user)
        else:
            new_task = Task(task=add_form.task.data, due_date=due_date, priority=priority,
                            label=label, label_color=label_color, user=user)

        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for("get_tasks"))
    return render_template("index.html", form=add_form)


@app.route("/edit/<int:task_id>", methods=["GET", "POST"])
@login_required
def edit_task_name(task_id):
    """
    Updates the name of a user's task.

    Args:
        task_id (int): The id of a task to be renamed.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    edit_form = EditTaskForm()

    if edit_form.validate_on_submit():
        task_to_update = db.get_or_404(Task, task_id)
        task_to_update.task = edit_form.task.data
        db.session.commit()
        return redirect(url_for("get_tasks"))
    return render_template("index.html", edit_form=edit_form)


@app.route("/delete/<int:task_id>")
@login_required
def delete_task(task_id):
    """
    Deletes a user's task from the database table.

    Args:
        task_id (int): The id of a task to be deleted.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    task_to_delete = db.get_or_404(Task, task_id)
    db.session.delete(task_to_delete)
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/favourites/<int:task_id>")
@login_required
def add_or_remove_favourites(task_id):
    """
    Marks or unmarks a user's task from favourites based on current status.

    Args:
        task_id (int): The id of a task to be marked or unmarked as favourite.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    favourite_task = db.get_or_404(Task, task_id)
    favourite_task.is_favourite = not favourite_task.is_favourite
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/due-date/<int:task_id>", methods=["GET", "POST"])
@login_required

def edit_due_date(task_id):
    """
    Updates or removes the due date of a user's task.

    Args:
        task_id (int): The id of a task for which the due date is to be updated or removed.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    due_date = db.get_or_404(Task, task_id)
    due_date_str = request.form.get("new-due-date")
    if due_date_str == "":
        due_date_str = None
    due_date.due_date = due_date_str
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/priority/<int:task_id>/<int:task_priority>")
@login_required
def add_priority(task_id, task_priority):
    """
    Updates the priority for a user's task.

    Args:
        task_id (int): The id of a task for which the priority is updated.
        task_priority (int): The new priority for the task.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    priority = db.get_or_404(Task, task_id)
    priority.priority = task_priority
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/label/<int:task_id>", methods=["GET", "POST"])
@login_required
def add_label(task_id):
    """
    Assigns a label and a label color to a user's task.

    Args:
        task_id (int): The id of a task to be assigned a label and label color.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    label = db.get_or_404(Task, task_id)
    label_str = request.form.get("label-in-list").title()
    label_color_str = request.form.get("label-color-list")
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    all_labels = list(set([task.label for task in tasks if task.label is not None]))
    all_labels_colors = list(set([task.label_color for task in tasks if task.label is not None]))

    if label_str.strip() == "":
        label_str = None
        label_color_str = None

    same_label_tasks = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.label == label_str)).scalars()

    for task in same_label_tasks:
        task.label_color = label_color_str

    label.label = label_str
    label.label_color = label_color_str
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/status/<int:task_id>", methods=["GET", "POST"])
@login_required
def add_status(task_id):
    """
    Changes the completion status of a user's task (e.g. 'Not Complete' to 'Complete' and vica-versa.

    Args:
        task_id (int): The id of a task to be set as 'Complete' or 'Not Complete.

    Returns:
        Response: The main HTML page with user's tasks.
    """
    status = db.get_or_404(Task, task_id)
    new_status = request.form.get("status")
    if new_status == "on":
        new_status = "Complete"
    else:
        new_status = "Not Complete"

    status.status = new_status
    db.session.commit()
    return redirect(url_for("get_tasks"))


@app.route("/favourites")
@login_required
def get_favourites():
    """
    Fetches all the user's task marked as favourite.

    Returns:
        Response: The HTML page with user's favourite tasks.
    """
    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    favourite_tasks = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.is_favourite==True)).scalars().all()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    return render_template("favourites.html", label_tasks=labeled_tasks, all_tasks=favourite_tasks, form=add_form, edit_form=edit_form)


@app.route("/completed")
@login_required
def get_completed():
    """
    Fetches all the user's task marked as 'Complete'.

    Returns:
        Response: The HTML page with user's completed tasks.
    """
    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    completed_tasks = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.status=="Complete")).scalars().all()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    return render_template("completed.html", label_tasks=labeled_tasks, all_tasks=completed_tasks, form=add_form, edit_form=edit_form)


@app.route("/labels/<label>")
@login_required
def get_label_tasks(label):
    """
    Fetches all the user's task with a specific label.

    Args:
        label (str): The name of the label assigned to tasks.

    Returns:
        Response: The HTML page with user's tasks with a specific assigned label.
    """
    add_form = AddTaskForm()
    edit_form = EditTaskForm()
    one_label_tasks = db.session.execute(db.select(Task).where(Task.user == current_user,  Task.label==label)).scalars().all()
    result = db.session.execute(db.select(Task).where(Task.user == current_user))
    tasks = result.scalars().all()
    labeled_tasks = []
    labels = []

    for task in tasks:
        if task.label and task.label not in labels:
            labeled_tasks.append(task)
            labels.append(task.label)

    return render_template("label.html", label_tasks=labeled_tasks, all_tasks=one_label_tasks, form=add_form, edit_form=edit_form)


if __name__ == "__main__":
    app.run(debug=True, port=5001)