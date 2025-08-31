from django.db import models
from django.conf import settings
from servers.models import Server

class ServerReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('daily', 'Daily Summary'),
        ('weekly', 'Weekly Summary'),
        ('monthly', 'Monthly Summary'),
        ('performance', 'Performance Analysis'),
        ('utilization', 'Resource Utilization'),
        ('incident', 'Incident Report'),
    ]
    
    REPORT_STATUS_CHOICES = [
        ('generated', 'Generated'),
        ('processing', 'Processing'),
        ('failed', 'Failed'),
    ]
    
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='reports')
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default='generated')
    
    # Основные метрики
    avg_cpu_usage = models.FloatField(help_text="Average CPU usage in %")
    avg_memory_usage = models.FloatField(help_text="Average memory usage in %")
    max_cpu_usage = models.FloatField(help_text="Maximum CPU usage in %")
    max_memory_usage = models.FloatField(help_text="Maximum memory usage in %")
    storage_used = models.FloatField(help_text="Storage used in GB")
    network_in_total = models.FloatField(help_text="Total network input in GB", default=0)
    network_out_total = models.FloatField(help_text="Total network output in GB", default=0)
    
    # Доступность
    uptime_percentage = models.FloatField(help_text="Uptime percentage")
    downtime_minutes = models.IntegerField(help_text="Total downtime in minutes")
    incidents_count = models.IntegerField(help_text="Number of incidents", default=0)
    
    # Дополнительная информация
    summary = models.TextField(blank=True, help_text="Report summary")
    recommendations = models.TextField(blank=True, help_text="Recommendations")
    raw_data = models.JSONField(default=dict, blank=True, help_text="Raw metrics data")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-period_end']
        indexes = [
            models.Index(fields=['server', 'period_end']),
            models.Index(fields=['report_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.server.name} ({self.period_start.date()} to {self.period_end.date()})"
    
    @property
    def period_days(self):
        """Calculate the number of days in the report period"""
        from django.utils.timezone import timedelta
        delta = self.period_end - self.period_start
        return delta.days
    
    @property
    def cost_efficiency(self):
        """Calculate cost efficiency score"""
        if self.total_cost > 0 and self.uptime_percentage > 0:
            return round((self.uptime_percentage / float(self.total_cost)) * 100, 2)
        return 0

class ReportTemplate(models.Model):
    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=20, choices=ServerReport.REPORT_TYPE_CHOICES)
    content = models.TextField(help_text="Template content with placeholders")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.template_type})"

class AutomatedReportSchedule(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    name = models.CharField(max_length=100)
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    is_active = models.BooleanField(default=True)
    recipients = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)
    last_generated = models.DateTimeField(null=True, blank=True)
    next_generation = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.server.name} ({self.frequency})"