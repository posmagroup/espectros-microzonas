# -*- coding: utf-8 -*-

from django.contrib import admin
from apps.microzonificacion.models import Microzone

class MicrozoneAdmin(admin.ModelAdmin):
    list_display = ('label', 'arg_a0')

admin.site.register(Microzone, MicrozoneAdmin)
