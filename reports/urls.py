from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reports', views.ServerReportViewSet, basename='report')
router.register(r'report-templates', views.ReportTemplateViewSet, basename='reporttemplate')
router.register(r'report-schedules', views.AutomatedReportScheduleViewSet, basename='reportschedule')

urlpatterns = [
    path('', include(router.urls)),
    path('servers/<int:server_id>/reports/', views.ServerReportsListView.as_view(), name='server-reports'),
    path('reports-stats/', views.ReportStatsView.as_view(), name='report-stats'),
]