from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from .db_ops import DbOperations
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

dbops = DbOperations()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def get_limited_data(data):
    return {
        "username": data["username"],
        "email": "" if data["email"] is None else data["email"],
    }


class UserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            data = get_limited_data(UserSerializer(user).data)
            print(f"User Posting: {data}")
            return Response(
                {
                    "user": data,
                    "tokens": tokens,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user_list = dbops.get_all()
        serialized = UserSerializer(user_list, many=True).data
        return Response(serialized)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN
            )
        try:
            user = dbops.get_by_id(pk)
            if user is None:
                return Response(
                    {"error": "user not found."}, status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response({"message": "user deleted."}, status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        try:
            user = dbops.get_by_id(pk)
            if user is None:
                return Response(
                    {"error": "user not found."}, status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def login(self, request):
        queryset = self.get_queryset()
        username_or_email = request.data.get("username_or_email")
        password = request.data.get("password")

        if not username_or_email or not password:
            return Response(
                {"detail": "Username/email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username_or_email, password=password)
        if user is None:
            # Try to authenticate by email
            try:
                user_obj = get_user_model().objects.get(email=username_or_email)
                user = authenticate(
                    request, username=user_obj.username, password=password
                )
            except get_user_model().DoesNotExist:
                user = None
        if user is not None:
            tokens = get_tokens_for_user(user)
            data = UserSerializer(user).data
            return Response(
                {
                    "user": data,
                    "tokens": tokens,
                },
                status=status.HTTP_200_OK,
            )
        else:
            # Invalid credentials
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )
