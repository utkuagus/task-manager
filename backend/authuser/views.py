from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .db_ops import DbOperations

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
