from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now


class Task(models.Model):
    title = models.CharField(max_length=255)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.title} (Due: {self.due_date}) - {'Done' if self.is_completed else 'Todo'}"

    @property
    def is_overdue(self):
        return not self.is_completed and self.due_date < now().date()
