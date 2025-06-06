from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

"""urlpatterns = [
    path("", TaskView.as_view()),
    path("<int:pk>", TaskView.as_view()),
    path("complete/<int:pk>", TaskCompleteView.as_view()),
    path("todo/<int:pk>", TaskTodoView.as_view()),
]"""

router = DefaultRouter()
router.register(r"", TaskViewSet, basename="task")

urlpatterns = router.urls
