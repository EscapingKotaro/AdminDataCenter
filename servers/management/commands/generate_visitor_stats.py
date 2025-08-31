from django.core.management.base import BaseCommand
from django.utils import timezone
from servers.models import Server, ServerMetric
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Generate sample visitor statistics for servers'
    
    def handle(self, *args, **options):
        servers = Server.objects.all()
        
        # Генерируем данные за последние 7 дней
        for i in range(7):
            date = timezone.now() - timedelta(days=i)
            
            for server in servers:
                total = random.randint(100, 1000)
                desktop = random.randint(int(total * 0.4), int(total * 0.7))
                mobile = total - desktop
                
                ServerMetric.objects.create(
                    server=server,
                    cpu_usage=random.uniform(10, 80),
                    memory_usage=random.uniform(20, 90),
                    network_in=random.uniform(50, 500),
                    network_out=random.uniform(30, 300),
                    visitors_total=total,
                    visitors_desktop=desktop,
                    visitors_mobile=mobile,
                    timestamp=date
                )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully generated visitor statistics')
        )