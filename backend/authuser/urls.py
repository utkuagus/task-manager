from rest_framework.routers import DefaultRouter
from .views import UserViewSet

"""urlpatterns = [
    path("", UserView.as_view()),
    path("<int:pk>/", UserView.as_view()),
]"""

router = DefaultRouter()
router.register(r"", UserViewSet, basename="authuser")

urlpatterns = router.urls
