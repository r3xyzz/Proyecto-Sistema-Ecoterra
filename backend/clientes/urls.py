from django.urls import path

from .views import ClienteDetailView, ClienteListView

urlpatterns = [
    path("clientes/", ClienteListView.as_view(), name="clientes-list"),
    path("clientes/<int:pk>/", ClienteDetailView.as_view(), name="clientes-detail"),
]
