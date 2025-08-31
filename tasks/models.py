from django.db import models

class Task(models.Model):
    TASK_TYPES = [
        ('start', 'Start'),
        ('stop', 'Stop'),
        ('restart', 'Restart'),
        ('execute', 'Execute Command'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    server = models.ForeignKey('servers.Server', on_delete=models.CASCADE)
    task_type = models.CharField(max_length=20, choices=TASK_TYPES)
    command = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    output = models.TextField(blank=True)
    
    def __str__(self):
        return f"Task {self.id} - {self.task_type}"