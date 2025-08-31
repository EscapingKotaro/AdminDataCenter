from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Server, ServerAction
from .serializers import ServerSerializer, ServerActionSerializer, ServerStatusUpdateSerializer
from authentication.permissions import IsAdmin, IsOwnerOrAdmin

class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer
    permission_classes = [IsAdmin]  # Только админы
    
    @action(detail=True, methods=['post'])
    def manage(self, request, pk=None):
        server = self.get_object()
        serializer = ServerStatusUpdateSerializer(
            data=request.data, 
            context={'server': server}
        )
        
        if serializer.is_valid():
            action_type = serializer.validated_data['action']
            
            try:
                # Создаем запись о действии
                server_action = ServerAction.objects.create(
                    server=server,
                    action=action_type,
                    initiated_by=request.user if request.user.is_authenticated else None,
                    status='in_progress'
                )
                
                # Обновляем статус сервера
                if action_type == 'start':
                    server.status = 'online'
                elif action_type == 'stop':
                    server.status = 'offline'
                elif action_type == 'restart':
                    server.status = 'restarting'
                    # Здесь можно добавить логику ожидания перезагрузки
                    server.status = 'online'
                elif action_type == 'maintenance':
                    server.status = 'maintenance'
                
                server.save()
                
                # Обновляем статус действия
                server_action.status = 'completed'
                server_action.save()
                
                return Response({
                    'success': True,
                    'message': f'Сервер {server.name} {self.get_action_message(action_type)}',
                    'new_status': server.status
                })
                
            except Exception as e:
                # Если произошла ошибка
                server_action.status = 'failed'
                server_action.error_message = str(e)
                server_action.save()
                
                return Response({
                    'success': False,
                    'message': f'Ошибка при выполнении действия: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_action_message(self, action):
        messages = {
            'start': 'успешно запущен',
            'stop': 'успешно остановлен',
            'restart': 'успешно перезагружен',
            'maintenance': 'переведен в режим обслуживания'
        }
        return messages.get(action, 'обработан')
    
    @action(detail=True, methods=['get'])
    def actions(self, request, pk=None):
        server = self.get_object()
        actions = server.actions.all().order_by('-created_at')[:50]
        serializer = ServerActionSerializer(actions, many=True)
        return Response(serializer.data)

class ServerActionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServerAction.objects.all()
    serializer_class = ServerActionSerializer
    permission_classes = [IsAdmin]  # Только админы
    
    def get_queryset(self):
        queryset = ServerAction.objects.all()
        server_id = self.request.query_params.get('server_id')
        if server_id:
            queryset = queryset.filter(server_id=server_id)
        return queryset.order_by('-created_at')