from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import UserProfile, Transaction, BillingSettings
from .serializers import UserProfileSerializer, TransactionSerializer, BillingSettingsSerializer
from decimal import Decimal
from authentication.permissions import IsAdmin, IsOwnerOrAdmin

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsOwnerOrAdmin]  # Владелец или админ
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def deposit(self, request):
        amount = Decimal(request.data.get('amount', 0))
        
        if amount <= 0:
            return Response(
                {'error': 'Amount must be positive'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        profile = UserProfile.objects.get(user=request.user)
        profile.balance += amount
        profile.save()
        
        Transaction.objects.create(
            user=request.user,
            amount=amount,
            transaction_type='deposit',
            description=f'Пополнение баланса на ${amount}'
        )
        
        return Response({'new_balance': profile.balance})

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    
    permission_classes = [IsOwnerOrAdmin]  # Владелец или админ
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import BillingSettings
from .serializers import BillingSettingsSerializer

class BillingSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = BillingSettingsSerializer
    http_method_names = ['get', 'put', 'patch']  # Только чтение и обновление
    
    def get_queryset(self):
        return BillingSettings.objects.all()
    
    def get_object(self):
        # Всегда возвращаем первую (и единственную) запись
        return get_object_or_404(BillingSettings, pk=1)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Сохраняем пользователя, который обновил настройки
            serializer.save(updated_by=request.user)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Получить текущие настройки"""
        settings = BillingSettings.objects.first()
        if not settings:
            # Создаем настройки по умолчанию если их нет
            settings = BillingSettings.objects.create()
        
        serializer = self.get_serializer(settings)
        return Response(serializer.data)