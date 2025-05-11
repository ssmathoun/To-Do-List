from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField, PasswordField, EmailField
from wtforms.validators import DataRequired, Length, Email


class AddTaskForm(FlaskForm):
    """
    A form to add a task for a user.

    Attributes:
        task (StringField) -- Name of a task.
        is_favourite (BooleanField) -- Favourite status of a task.
        submit (SubmitField) -- Submit Button to add a task.
    """
    task = StringField(label="Add Task", validators=[DataRequired()])
    is_favourite = BooleanField()
    submit = SubmitField("Add Task")


class EditTaskForm(FlaskForm):
    """
    A form to update a task's name for a user.

    Attributes:
        task (StringField) -- New Name of a task.
        submit (SubmitField) -- Submit Button to add a task.
    """
    task = StringField(label="Update Task", validators=[DataRequired()])
    submit = SubmitField("Update Task")


class RegisterForm(FlaskForm):
    """
    A form to handle user registration.

    Attributes:
        email (EmailField) -- Email of a user to be used for registration. Must be unique.
        password (PasswordField) -- New password of a user.
        submit (SubmitField) -- Submit Button to register a user.
    """
    email = EmailField("Email",
                       validators=[DataRequired(), Length(max=100), Email("Valid Email is Required.")],
                       render_kw={"class": "form-control form-control-lg",
                                  "style": "width: 25vw;"})
    password = PasswordField("Password",
                             validators=[DataRequired(), Length(max=100)],
                             render_kw={"class": "form-control form-control-lg",
                                        "style": "width: 25vw;"})

    submit = SubmitField("Register",
                         render_kw={"style": "width: 25vw; background-color: #00308F;"})


class LoginForm(FlaskForm):
    """
    A form to handle user login.

    Attributes:
        email (EmailField) -- Email of a user to be used for login.
        password (PasswordField) -- Password of a user.
        submit (SubmitField) -- Submit Button to log in a user.
    """
    email = EmailField("Email",
                       validators=[DataRequired(), Length(max=100), Email(message="Valid Email is Required.")],
                       render_kw = {"class": "form-control form-control-lg",
                                    "style": "width: 25vw;"})
    password = PasswordField("Password",
                             validators=[DataRequired(), Length(max=100)],
                             render_kw = {"class": "form-control form-control-lg",
                                          "style": "width: 25vw;"})


    submit = SubmitField("Log In",
                         render_kw = {"style": "width: 25vw; background-color: #00308F;"})