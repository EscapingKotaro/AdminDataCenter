from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - ${self.balance}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'Пополнение'),
        ('withdrawal', 'Списание'),
        ('server_creation', 'Создание сервера'),
        ('daily_charge', 'Ежедневное списание'),
        ('refund', 'Возврат средств'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_transaction_type_display()} - ${self.amount}"

class BillingSettings(models.Model):
    cpu_price_per_hour = models.DecimalField(max_digits=10, decimal_places=6, default=0.0025)
    ram_price_per_hour = models.DecimalField(max_digits=10, decimal_places=6, default=0.0010)
    storage_price_per_hour = models.DecimalField(max_digits=10, decimal_places=6, default=0.0005)
    gpu_price_per_hour = models.DecimalField(max_digits=10, decimal_places=6, default=0.0100)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        verbose_name = "Billing Settings"
        verbose_name_plural = "Billing Settings"
    
    def __str__(self):
        return f"Billing Settings (updated: {self.updated_at})"
    
    def save(self, *args, **kwargs):
        # Всегда только одна запись настроек
        if not self.pk and BillingSettings.objects.exists():
            # Если запись уже существует, обновляем её
            existing = BillingSettings.objects.first()
            existing.cpu_price_per_hour = self.cpu_price_per_hour
            existing.ram_price_per_hour = self.ram_price_per_hour
            existing.storage_price_per_hour = self.storage_price_per_hour
            existing.gpu_price_per_hour = self.gpu_price_per_hour
            existing.updated_by = self.updated_by
            return existing.save(*args, **kwargs)
        return super().save(*args, **kwargs)