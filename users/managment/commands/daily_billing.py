from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from users.models import Transaction, UserProfile
from servers.models import Server
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Perform daily billing for all active servers'
    
    def handle(self, *args, **options):
        self.stdout.write('Starting daily billing process...')
        
        active_servers = Server.objects.filter(is_active=True, user__isnull=False)
        total_charged = Decimal('0.00')
        successful_charges = 0
        failed_charges = 0
        
        for server in active_servers:
            try:
                # Рассчитываем стоимость за 24 часа
                daily_cost = server.hourly_rate * Decimal('24.0')
                
                user_profile = UserProfile.objects.get(user=server.user)
                
                if user_profile.balance >= daily_cost:
                    # Списание средств
                    user_profile.balance -= daily_cost
                    user_profile.save()
                    
                    # Создаем транзакцию
                    Transaction.objects.create(
                        user=server.user,
                        amount=daily_cost,
                        transaction_type='daily_charge',
                        description=f'Ежедневное списание за сервер {server.name}'
                    )
                    
                    total_charged += daily_cost
                    successful_charges += 1
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Charged ${daily_cost:.4f} from {server.user.username} for {server.name}'
                        )
                    )
                else:
                    # Недостаточно средств - отключаем сервер
                    server.is_active = False
                    server.status = 'offline'
                    server.save()
                    
                    failed_charges += 1
                    
                    self.stdout.write(
                        self.style.WARNING(
                            f'Insufficient funds for {server.user.username}. Server {server.name} disabled.'
                        )
                    )
                    
            except Exception as e:
                logger.error(f'Error processing billing for server {server.id}: {e}')
                failed_charges += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Billing completed. Total charged: ${total_charged:.2f}, '
                f'Successful: {successful_charges}, Failed: {failed_charges}'
            )
        )