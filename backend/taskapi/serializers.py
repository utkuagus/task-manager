from rest_framework import serializers
from django.contrib.auth.models import User
from .models.task import Task


class TaskSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    user_id = serializers.PrimaryKeyRelatedField(
        source="user",
        queryset=User.objects.all(),
        required=False,
    )

    class Meta:
        model = Task
        fields = ["id", "title", "due_date", "is_completed", "user_id"]
