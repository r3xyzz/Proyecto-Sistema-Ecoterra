from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Usuario
from .serializers import UsuarioSerializer


class UsuarioListView(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class UsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer