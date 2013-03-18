from django.contrib import admin
from apps.microzonificacion.models import Microzone

class MicrozoneAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'label',
        'arg_a0',
        'phi',
        'beta',
        'arg_ta',
        'arg_t0',
        'arg_tstar',
        'arg_td',
        'arg_m',
        'arg_p',
    )
admin.site.register(Microzone, MicrozoneAdmin)
