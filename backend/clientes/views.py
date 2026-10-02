from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import NotFound

from .models import Cliente, Direccion
from .serializers import ClienteSerializer, DireccionSerializer


class ClienteListView(ListCreateAPIView):
    queryset = Cliente.objects.all().prefetch_related("direcciones")
    serializer_class = ClienteSerializer


class ClienteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all().prefetch_related("direcciones")
    serializer_class = ClienteSerializer


class DireccionListCreateView(ListCreateAPIView):
    serializer_class = DireccionSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["cliente"] = Cliente.objects.get(pk=self.kwargs["cliente_id"])
        return context

    def get_queryset(self):
        return Direccion.objects.filter(cliente_id=self.kwargs["cliente_id"])
    def perform_create(self, serializer):
        try:
            cliente = Cliente.objects.get(pk=self.kwargs["cliente_id"])
        except Cliente.DoesNotExist as error:
            raise NotFound("Cliente no encontrado") from error
        serializer.save(cliente=cliente)


class DireccionDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = DireccionSerializer

    def get_queryset(self):
        return Direccion.objects.filter(cliente_id=self.kwargs["cliente_id"])

