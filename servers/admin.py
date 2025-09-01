from django.contrib import admin
from django.utils.html import format_html
from .models import Server, ServerAction

@admin.register(Server)
class ServerAdmin(admin.ModelAdmin):
    list_display = ('name', 'ip_address', 'status', 'cpu_cores', 'ram', 'storage', 'status_badge', 'hourly_rate', 'is_active')
    list_filter = ('status', 'is_active', 'cpu_cores', 'ram')
    search_fields = ('name', 'ip_address', 'gpu_model')
    list_editable = ('status', 'is_active', 'hourly_rate')
    readonly_fields = ('get_current_metrics_display',)
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'ip_address', 'status', 'is_active', 'hourly_rate')
        }),
        ('Аппаратные характеристики', {
            'fields': ('cpu_cores', 'cpu_frequency', 'gpu_model', 'gpu_memory', 'ram', 'storage')
        }),
        ('Мониторинг', {
            'fields': ('get_current_metrics_display',),
            'classes': ('collapse',)
        }),
    )
    
    # Красивые бейджи для статуса
    def status_badge(self, obj):
        colors = {
            'online': 'green',
            'offline': 'gray', 
            'maintenance': 'orange',
            'restarting': 'blue'
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 5px 10px; border-radius: 10px; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    
    # Отображение метрик
    def get_current_metrics_display(self, obj):
        metrics = obj.get_current_metrics()
        return format_html(
            '''
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h4>Текущие метрики:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>CPU:</strong> {}%</div>
                    <div><strong>Память:</strong> {}%</div>
                    <div><strong>Сеть (in):</strong> {} MB/s</div>
                    <div><strong>Сеть (out):</strong> {} MB/s</div>
                    <div><strong>Температура:</strong> {}°C</div>
                </div>
            </div>
            ''',
            metrics['cpu_usage'],
            metrics['memory_usage'], 
            metrics['network_in'],
            metrics['network_out'],
            metrics['temperature']
        )
    get_current_metrics_display.short_description = 'Текущие метрики'

@admin.register(ServerAction)
class ServerActionAdmin(admin.ModelAdmin):
    list_display = ('server', 'action_badge', 'status_badge', 'initiated_by', 'created_at', 'completed_at')
    list_filter = ('action', 'status', 'created_at')
    search_fields = ('server__name', 'error_message')
    readonly_fields = ('created_at', 'completed_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('server', 'action', 'status', 'initiated_by')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'completed_at'),
            'classes': ('collapse',)
        }),
        ('Ошибки', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        }),
    )
    
    # Бейдж для действия
    def action_badge(self, obj):
        colors = {
            'start': 'green',
            'stop': 'red',
            'restart': 'blue', 
            'maintenance': 'orange'
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 8px; font-size: 12px;">{}</span>',
            colors.get(obj.action, 'gray'),
            obj.get_action_display()
        )
    action_badge.short_description = 'Действие'
    
    # Бейдж для статуса
    def status_badge(self, obj):
        colors = {
            'pending': 'gray',
            'in_progress': 'blue',
            'completed': 'green',
            'failed': 'red'
        }
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 8px; font-size: 12px;">{}</span>',
            colors.get(obj.status, 'gray'),
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
