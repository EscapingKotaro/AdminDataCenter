from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
import json

from .models import ServerReport, ReportTemplate, AutomatedReportSchedule
from .serializers import (
    ServerReportSerializer, 
    ReportTemplateSerializer,
    AutomatedReportScheduleSerializer,
    ReportGenerateSerializer
)
from servers.models import Server

class ServerReportViewSet(viewsets.ModelViewSet):
    queryset = ServerReport.objects.all().select_related('server', 'generated_by')
    serializer_class = ServerReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['server', 'report_type', 'status', 'period_start', 'period_end']
    
    def get_queryset(self):
        """Return reports for user's accessible servers"""
        queryset = super().get_queryset()
        
        # Можно добавить фильтрацию по правам доступа к серверам
        # Например, если у пользователя есть доступ только к определенным серверам
        return queryset
    
    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        """Generate a new report for a server"""
        serializer = ReportGenerateSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            server_id = data['server_id']
            report_type = data['report_type']
            
            try:
                server = Server.objects.get(id=server_id)
                
                # Определяем период отчета
                end_date = timezone.now()
                if report_type == 'daily':
                    start_date = end_date - timedelta(days=1)
                elif report_type == 'weekly':
                    start_date = end_date - timedelta(weeks=1)
                elif report_type == 'monthly':
                    start_date = end_date - timedelta(days=30)
                else:
                    start_date = data.get('start_date', end_date - timedelta(days=1))
                    end_date = data.get('end_date', timezone.now())
                
                # Здесь должна быть логика сбора реальных метрик
                # Сейчас заглушка с тестовыми данными
                report_data = {
                    'avg_cpu_usage': 45.7,
                    'avg_memory_usage': 62.3,
                    'max_cpu_usage': 98.1,
                    'max_memory_usage': 85.4,
                    'storage_used': 125.8,
                    'network_in_total': 12.5,
                    'network_out_total': 8.3,
                    'uptime_percentage': 99.8,
                    'downtime_minutes': 28,
                    'incidents_count': 2,
                    'total_cost': float(server.hourly_rate) * 24 * (end_date - start_date).days,
                    'hourly_cost': float(server.hourly_rate)
                }
                
                # Создаем отчет
                report = ServerReport.objects.create(
                    title=f"{report_type.title()} Report - {server.name}",
                    report_type=report_type,
                    server=server,
                    generated_by=request.user,
                    period_start=start_date,
                    period_end=end_date,
                    **report_data,
                    summary=f"Automated {report_type} report for {server.name}",
                    recommendations="Consider optimizing memory usage during peak hours",
                    raw_data=report_data
                )
                
                return Response(
                    ServerReportSerializer(report).data, 
                    status=status.HTTP_201_CREATED
                )
                
            except Server.DoesNotExist:
                return Response(
                    {'error': 'Server not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download report as JSON or other format"""
        report = self.get_object()
        
        # Формируем данные для скачивания
        report_data = {
            'title': report.title,
            'server': report.server.name,
            'period': f"{report.period_start} - {report.period_end}",
            'metrics': {
                'cpu_usage': {
                    'average': report.avg_cpu_usage,
                    'maximum': report.max_cpu_usage
                },
                'memory_usage': {
                    'average': report.avg_memory_usage,
                    'maximum': report.max_memory_usage
                },
                'storage_used_gb': report.storage_used,
                'network_traffic_gb': {
                    'in': report.network_in_total,
                    'out': report.network_out_total
                },
                'availability': {
                    'uptime_percentage': report.uptime_percentage,
                    'downtime_minutes': report.downtime_minutes,
                    'incidents': report.incidents_count
                },
                'costs': {
                    'total': float(report.total_cost),
                    'hourly': float(report.hourly_cost)
                }
            },
            'summary': report.summary,
            'recommendations': report.recommendations,
            'generated_at': report.created_at.isoformat(),
            'generated_by': report.generated_by.username if report.generated_by else 'System'
        }
        
        response = Response(report_data)
        response['Content-Disposition'] = f'attachment; filename="{report.title.replace(" ", "_")}.json"'
        return response

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['template_type', 'is_active']

class AutomatedReportScheduleViewSet(viewsets.ModelViewSet):
    queryset = AutomatedReportSchedule.objects.all().select_related('server')
    serializer_class = AutomatedReportScheduleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['server', 'frequency', 'is_active']
    
    @action(detail=True, methods=['post'])
    def trigger_now(self, request, pk=None):
        """Trigger report generation immediately"""
        schedule = self.get_object()
        
        # Логика генерации отчета
        # Можно вызвать ту же логику, что и в generate_report
        
        return Response({
            'status': 'success',
            'message': f'Report generation triggered for {schedule.server.name}'
        })

class ServerReportsListView(generics.ListAPIView):
    """Get all reports for specific server"""
    serializer_class = ServerReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        server_id = self.kwargs['server_id']
        return ServerReport.objects.filter(server_id=server_id).order_by('-period_end')

class ReportStatsView(generics.RetrieveAPIView):
    """Get statistics about reports"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        stats = {
            'total_reports': ServerReport.objects.count(),
            'reports_by_type': dict(ServerReport.objects.values_list('report_type')
                                  .annotate(count=models.Count('id'))
                                  .order_by('-count')),
            'recent_reports': ServerReport.objects.order_by('-created_at')[:5].values(
                'id', 'title', 'server__name', 'created_at'
            ),
            'avg_uptime': ServerReport.objects.aggregate(avg=models.Avg('uptime_percentage'))['avg'] or 0
        }
        
        return Response(stats)