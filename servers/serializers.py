from rest_framework import serializers
from .models import Server, ServerAction

class ServerSerializer(serializers.ModelSerializer):
    current_metrics = serializers.SerializerMethodField()
    
    class Meta:
        model = Server
        fields = '__all__'
    
    def get_current_metrics(self, obj):
        return obj.get_current_metrics()

class ServerActionSerializer(serializers.ModelSerializer):
    server_name = serializers.CharField(source='server.name', read_only=True)
    initiated_by_username = serializers.CharField(source='initiated_by.username', read_only=True)
    
    class Meta:
        model = ServerAction
        fields = '__all__'

class ServerStatusUpdateSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['start', 'stop', 'restart', 'maintenance'])
    
    def validate_action(self, value):
        server = self.context['server']
        
        if value == 'start' and server.status == 'online':
            raise serializers.ValidationError("Сервер уже запущен")
        if value == 'stop' and server.status == 'offline':
            raise serializers.ValidationError("Сервер уже остановлен")
        if value == 'restart' and server.status == 'offline':
            raise serializers.ValidationError("Нельзя перезагрузить остановленный сервер")
            
        return value