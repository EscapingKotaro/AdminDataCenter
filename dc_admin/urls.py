from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from servers.views import ServerViewSet,ServerActionViewSet
from tasks.views import TaskViewSet
from notifications.views import NotificationViewSet
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import UserProfileViewSet, TransactionViewSet, BillingSettingsViewSet
from django.urls import include, path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Настройки Swagger
schema_view = get_schema_view(
   openapi.Info(
      title="AdminDataCenter API",
      default_version='v1',
      description="API documentation for AdminDataCenter",
      terms_of_service="https://your-terms-of-service.com/",
      contact=openapi.Contact(email="admin@datacenter.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


router = DefaultRouter()
router.register(r'servers', ServerViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'user/profile', UserProfileViewSet, basename='userprofile')
router.register(r'user/transactions', TransactionViewSet, basename='transaction')
router.register(r'billing/settings', BillingSettingsViewSet, basename='billingsettings')
router.register(r'server-actions', ServerActionViewSet)


urlpatterns = [

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('authentication.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/reports/', include('reports.urls')),
]

