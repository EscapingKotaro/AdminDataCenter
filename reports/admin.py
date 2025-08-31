from django.contrib import admin
from .models import *
admin.site.register(ServerReport)
admin.site.register(ReportTemplate)
admin.site.register(AutomatedReportSchedule)
