from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Cliente
from .serializers import ClienteSerializer


class ClienteListView(ListCreateAPIView):
    queryset = Cliente.objects.all().prefetch_related("direcciones")
    serializer_class = ClienteSerializer


class ClienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all().prefetch_related("direcciones")
    serializer_class = ClienteSerializer
