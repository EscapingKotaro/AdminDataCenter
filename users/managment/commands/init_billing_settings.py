from django.core.management.base import BaseCommand
from users.models import BillingSettings

class Command(BaseCommand):
    help = 'Initialize default billing settings'
    
    def handle(self, *args, **options):
        if not BillingSettings.objects.exists():
            BillingSettings.objects.create()
            self.stdout.write(
                self.style.SUCCESS('Default billing settings created')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Billing settings already exist')
            )