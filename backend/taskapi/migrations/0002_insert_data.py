from django.db import migrations
from datetime import datetime


def import_old_tasks(apps, schema_editor):
    Task = apps.get_model("taskapi", "Task")

    old_tasks = [
        {"title": "Finish report", "due_date": "2025-06-10", "is_completed": False},
        {"title": "Call clients", "due_date": "2025-08-10", "is_completed": False},
        {
            "title": "Prepare presentation",
            "due_date": "2025-06-11",
            "is_completed": False,
        },
    ]

    for t in old_tasks:
        Task.objects.create(
            title=t["title"],
            due_date=datetime.strptime(t["due_date"], "%Y-%m-%d").date(),
            is_completed=t["is_completed"],
        )


class Migration(migrations.Migration):

    dependencies = [
        ("taskapi", "0001_initial"),  # Replace with your latest migration
    ]

    operations = [
        migrations.RunPython(import_old_tasks),
    ]
