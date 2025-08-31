from rest_framework import serializers
from .models import ServerReport, ReportTemplate, AutomatedReportSchedule

class ServerReportSerializer(serializers.ModelSerializer):
    server_name = serializers.CharField(source='server.name', read_only=True)
    generated_by_name = serializers.CharField(source='generated_by.username', read_only=True)
    period_days = serializers.ReadOnlyField()
    cost_efficiency = serializers.ReadOnlyField()
    
    class Meta:
        model = ServerReport
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ReportTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTemplate
        fields = '__all__'

class AutomatedReportScheduleSerializer(serializers.ModelSerializer):
    server_name = serializers.CharField(source='server.name', read_only=True)
    recipient_emails = serializers.SerializerMethodField()
    
    class Meta:
        model = AutomatedReportSchedule
        fields = '__all__'
    
    def get_recipient_emails(self, obj):
        return list(obj.recipients.values_list('email', flat=True))

class ReportGenerateSerializer(serializers.Serializer):
    server_id = serializers.IntegerField()
    report_type = serializers.ChoiceField(choices=ServerReport.REPORT_TYPE_CHOICES)
    start_date = serializers.DateTimeField(required=False)
    end_date = serializers.DateTimeField(required=False)
    
    def validate_server_id(self, value):
        from servers.models import Server
        if not Server.objects.filter(id=value).exists():
            raise serializers.ValidationError("Server does not exist")
        return value