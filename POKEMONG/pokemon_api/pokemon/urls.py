from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, TipoViewSet, PokemonViewSet

router = DefaultRouter()
router.register(r'regiones', RegionViewSet)
router.register(r'tipos', TipoViewSet)
router.register(r'pokemons', PokemonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
