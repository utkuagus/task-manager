from django.contrib.auth.models import User


class DbOperations:

    def get_all(self):
        return User.objects

    def get_by_username(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None

    def get_by_id(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None
