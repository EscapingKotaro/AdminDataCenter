from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from servers.views import ServerViewSet,ServerActionViewSet
from tasks.views import TaskViewSet
from notifications.views import NotificationViewSet
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users.views import UserProfileViewSet, TransactionViewSet, BillingSettingsViewSet

router = DefaultRouter()
router.register(r'servers', ServerViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'user/profile', UserProfileViewSet, basename='userprofile')
router.register(r'user/transactions', TransactionViewSet, basename='transaction')
router.register(r'billing/settings', BillingSettingsViewSet, basename='billingsettings')
router.register(r'server-actions', ServerActionViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('authentication.urls')),
   # path('api/', include('servers.urls')),
   # path('api/', include('users.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/reports/', include('reports.urls')),
]