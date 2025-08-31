from django.core.management.base import BaseCommand
from servers.models import Server

class Command(BaseCommand):
    help = 'Create sample server data'
    
    def handle(self, *args, **options):
        servers = [
            {
                'name': 'Web Server 01',
                'ip_address': '192.168.1.101',
                'cpu_cores': 8,
                'cpu_frequency': 3.6,
                'gpu_model': 'NVIDIA RTX 3080',
                'gpu_memory': 10,
                'ram': 32,
                'storage': 1000,
                'status': 'online'
            },
            {
                'name': 'Database Server',
                'ip_address': '192.168.1.102',
                'cpu_cores': 16,
                'cpu_frequency': 2.8,
                'gpu_model': '',
                'gpu_memory': None,
                'ram': 64,
                'storage': 2000,
                'status': 'online'
            },
            {
                'name': 'GPU Cluster Node',
                'ip_address': '192.168.1.103',
                'cpu_cores': 12,
                'cpu_frequency': 3.2,
                'gpu_model': 'NVIDIA A100',
                'gpu_memory': 40,
                'ram': 128,
                'storage': 4000,
                'status': 'maintenance'
            },
            {
                'name': 'Backup Server',
                'ip_address': '192.168.1.104',
                'cpu_cores': 4,
                'cpu_frequency': 2.4,
                'gpu_model': '',
                'gpu_memory': None,
                'ram': 16,
                'storage': 8000,
                'status': 'offline'
            }
        ]
        
        for server_data in servers:
            Server.objects.get_or_create(
                name=server_data['name'],
                defaults=server_data
            )
        
        self.stdout.write(self.style.SUCCESS('Successfully created sample servers'))