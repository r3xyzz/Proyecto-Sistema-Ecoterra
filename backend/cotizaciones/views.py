from rest_framework import viewsets
from .models import Cotizacion, DetalleCotizacion
from .serializers import CotizacionSerializer, DetalleCotizacionSerializer


class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.all().order_by("-id_cotizacion")
    serializer_class = CotizacionSerializer


class DetalleCotizacionViewSet(viewsets.ModelViewSet):
    queryset = DetalleCotizacion.objects.all()
    serializer_class = DetalleCotizacionSerializer