from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Server(models.Model):
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('maintenance', 'Maintenance'),
        ('restarting', 'Restarting'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    ip_address = models.GenericIPAddressField(unique=True)
    cpu_cores = models.IntegerField()
    cpu_frequency = models.FloatField(help_text="GHz")
    gpu_model = models.CharField(max_length=100, blank=True)
    gpu_memory = models.IntegerField(blank=True, null=True, help_text="GB")
    ram = models.IntegerField(help_text="GB")
    storage = models.IntegerField(help_text="GB")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='offline')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=4, default=0.00)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.ip_address})"
    
    def get_current_metrics(self):
        # Метод для получения текущих метрик (можно расширить)
        return {
            'cpu_usage': 0,
            'memory_usage': 0,
            'network_in': 0,
            'network_out': 0,
            'temperature': 0
        }

class ServerAction(models.Model):
    ACTION_CHOICES = [
        ('start', 'Start'),
        ('stop', 'Stop'),
        ('restart', 'Restart'),
        ('maintenance', 'Maintenance'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='actions')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.server.name} - {self.action} - {self.status}"