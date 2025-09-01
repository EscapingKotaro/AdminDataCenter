class Server(models.Model):
    STATUS_CHOICES = [
        ('online', 'Онлайн'),
        ('offline', 'Оффлайн'),
        ('maintenance', 'Обслуживание'),
        ('restarting', 'Перезагрузка'),
    ]
    
    name = models.CharField('Название сервера', max_length=100, unique=True)
    ip_address = models.GenericIPAddressField('IP адрес', unique=True)
    cpu_cores = models.IntegerField('Количество ядер CPU')
    cpu_frequency = models.FloatField('Частота CPU', help_text="ГГц")
    gpu_model = models.CharField('Модель GPU', max_length=100, blank=True)
    gpu_memory = models.IntegerField('Память GPU', blank=True, null=True, help_text="ГБ")
    ram = models.IntegerField('Оперативная память', help_text="ГБ")
    storage = models.IntegerField('Объем хранилища', help_text="ГБ")
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='offline')
    hourly_rate = models.DecimalField('Стоимость часа', max_digits=8, decimal_places=4, default=0.00)
    is_active = models.BooleanField('Активный', default=True)
    
    class Meta:
        verbose_name = 'Сервер'
        verbose_name_plural = 'Серверы'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.ip_address})"

class ServerAction(models.Model):
    ACTION_CHOICES = [
        ('start', 'Запуск'),
        ('stop', 'Остановка'),
        ('restart', 'Перезагрузка'),
        ('maintenance', 'Обслуживание'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Ожидание'),
        ('in_progress', 'В процессе'),
        ('completed', 'Завершено'),
        ('failed', 'Ошибка'),
    ]
    
    server = models.ForeignKey(Server, on_delete=models.CASCADE, verbose_name='Сервер', related_name='actions')
    action = models.CharField('Действие', max_length=20, choices=ACTION_CHOICES)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='pending')
    initiated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, verbose_name='Инициатор', null=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    completed_at = models.DateTimeField('Завершено', blank=True, null=True)
    error_message = models.TextField('Сообщение об ошибке', blank=True)
    
    class Meta:
        verbose_name = 'Действие с сервером'
        verbose_name_plural = 'Действия с серверами'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.server.name} - {self.get_action_display()} - {self.get_status_display()}"