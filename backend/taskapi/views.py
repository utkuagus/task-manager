from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import Task
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from django.utils.timezone import now, timedelta


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        task_type = request.query_params.get("type")
        queryset = self.get_queryset()

        if task_type == "todo":
            queryset = queryset.filter(is_completed=False)
        elif task_type == "completed":
            queryset = queryset.filter(is_completed=True)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["put"])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.is_completed = True
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=True, methods=["put"])
    def todo(self, request, pk=None):
        task = self.get_object()
        task.is_completed = False
        task.save()
        return Response(self.get_serializer(task).data)

    @action(detail=True, methods=["get"])
    def urgent(self, request):
        today = now().date()
        urgent_threshold = today + timedelta(days=2)

        urgent_tasks = (
            self.get_queryset()
            .filter(is_completed=False, due_date__lte=urgent_threshold)
            .order_by("due_date")
        )

        serializer = self.get_serializer(urgent_tasks, many=True)
        return Response(serializer.data)
